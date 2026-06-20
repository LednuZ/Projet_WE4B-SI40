import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-annonce-form',
  templateUrl: './annonce-form.component.html',
  styleUrls: ['./annonce-form.component.css']
})
export class AnnonceFormComponent implements OnInit {

  annonceForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  isEdit: boolean = false;
  annonceId: number | null = null;

  // Catalogue en cascade
  catalog: any[] = [];
  modeles: any[] = [];
  generations: any[] = [];
  versions: any[] = [];

  // Photos
  selectedFiles: File[] = [];
  previews: string[] = [];
  existingPhotos: { id_photo: number; url_photo: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private annonceService: AnnonceService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.annonceForm = this.fb.group({
      marque_id: ['', Validators.required],
      modele_id: ['', Validators.required],
      generation_id: ['', Validators.required],
      id_version: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(1)]],
      annee_circulation: ['', [Validators.required, Validators.min(1900), Validators.max(2026)]],
      kilometrage: [0, [Validators.required, Validators.min(0)]],
      etat: [''],
      couleur: [''],
      sellerie: [''],
      finition: [''],
      provenance: [''],
      localisation: [''],
      description: [''],
      premiere_main: [false],
      nombre_proprietaire: [''],
      controle_technique: ['']
    });

    // Charger le catalogue
    this.annonceService.getCatalogTree().subscribe({
      next: (data) => this.catalog = data,
      error: () => this.errorMessage = 'Erreur lors du chargement du catalogue'
    });

    // Quand "première main" est coché, bloquer nombre_proprietaire à 1
    this.annonceForm.get('premiere_main')!.valueChanges.subscribe((val: boolean) => {
      const ctrl = this.annonceForm.get('nombre_proprietaire')!;
      if (val) {
        ctrl.setValue(1);
        ctrl.disable();
      } else {
        ctrl.enable();
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.annonceId = Number(id);
      this.loadAnnonce(this.annonceId);
    }
  }

  loadAnnonce(id: number): void {
    this.annonceService.getAnnonce(id).subscribe({
      next: (annonce) => {
        // Trouver la marque, modèle, génération à partir de la version
        for (const marque of this.catalog) {
          for (const modele of marque.modeles) {
            for (const gen of modele.generations) {
              for (const ver of gen.versions) {
                if (ver.id === annonce.id_version) {
                  this.annonceForm.patchValue({ marque_id: marque.id });
                  this.onMarqueChange();
                  this.annonceForm.patchValue({ modele_id: modele.id });
                  this.onModeleChange();
                  this.annonceForm.patchValue({ generation_id: gen.id });
                  this.onGenerationChange();
                }
              }
            }
          }
        }

        this.annonceForm.patchValue({
          id_version: annonce.id_version,
          prix: annonce.prix,
          annee_circulation: annonce.annee_circulation,
          kilometrage: annonce.kilometrage,
          etat: annonce.etat || '',
          couleur: annonce.couleur || '',
          sellerie: annonce.sellerie || '',
          finition: annonce.finition || '',
          provenance: annonce.provenance || '',
          localisation: annonce.localisation || '',
          description: annonce.description || '',
          premiere_main: annonce.premiere_main,
          nombre_proprietaire: annonce.nombre_proprietaire || '',
          controle_technique: annonce.controle_technique || ''
        });

        this.existingPhotos = annonce.photos || [];

        // Appliquer l'état disabled si première main est coché
        if (annonce.premiere_main) {
          this.annonceForm.get('nombre_proprietaire')!.disable();
        }
      },
      error: () => this.errorMessage = 'Annonce introuvable'
    });
  }

  onMarqueChange(): void {
    const marqueId = Number(this.annonceForm.get('marque_id')?.value);
    const marque = this.catalog.find(m => m.id === marqueId);
    this.modeles = marque ? marque.modeles : [];
    this.generations = [];
    this.versions = [];
    this.annonceForm.patchValue({ modele_id: '', generation_id: '', id_version: '' });
  }

  onModeleChange(): void {
    const modeleId = Number(this.annonceForm.get('modele_id')?.value);
    const modele = this.modeles.find(m => m.id === modeleId);
    this.generations = modele ? modele.generations : [];
    this.versions = [];
    this.annonceForm.patchValue({ generation_id: '', id_version: '' });
  }

  onGenerationChange(): void {
    const genId = Number(this.annonceForm.get('generation_id')?.value);
    const gen = this.generations.find(g => g.id === genId);
    this.versions = gen ? gen.versions : [];
    this.annonceForm.patchValue({ id_version: '' });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = `"${file.name}" dépasse 5 Mo et a été ignorée`;
        return;
      }
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e) => this.previews.push(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removePreview(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
  }

  supprimerPhotoExistante(photoId: number): void {
    this.annonceService.supprimerPhoto(photoId).subscribe({
      next: () => this.existingPhotos = this.existingPhotos.filter(p => p.id_photo !== photoId),
      error: () => this.errorMessage = 'Erreur lors de la suppression de la photo'
    });
  }

  private uploadPhotos(annonceId: number, callback: () => void): void {
    if (this.selectedFiles.length === 0) { callback(); return; }
    forkJoin(this.selectedFiles.map(f => this.annonceService.uploadPhoto(annonceId, f))).subscribe({
      next: () => callback(),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || `Erreur ${err.status} lors de l'upload`;
        this.annonceId = annonceId;
        this.isEdit = true;
      }
    });
  }

  onSubmit(): void {
    if (this.annonceForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { marque_id, modele_id, generation_id, ...formData } = this.annonceForm.getRawValue();

    if (this.isEdit && this.annonceId) {
      this.annonceService.updateAnnonce(this.annonceId, formData).subscribe({
        next: () => this.uploadPhotos(this.annonceId!, () => this.router.navigate(['/annonces', this.annonceId])),
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
        }
      });
    } else {
      this.annonceService.createAnnonce(formData).subscribe({
        next: (res) => this.uploadPhotos(res.id_annonce, () => this.router.navigate(['/annonces', res.id_annonce])),
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }
}