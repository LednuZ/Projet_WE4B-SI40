<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

class JwtService
{
    private string $secret;

    public function __construct(
        #[Autowire(env: 'APP_SECRET')]
        string $secret = 'automarket_jwt_fallback_secret_key_123!#'
    ) {
        $this->secret = $secret;
    }

    /**
     * Génère un jeton JWT HS256 valide.
     */
    public function generateToken(array $payload, int $ttl = 86400): string
    {
        $header = json_encode([
            'alg' => 'HS256',
            'typ' => 'JWT'
        ]);

        $payload['exp'] = time() + $ttl;
        $payload['iat'] = time();

        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, $this->secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);

        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }

    /**
     * Valide et décode un jeton JWT HS256. Retourne le payload si valide, null sinon.
     */
    public function validateToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = $parts;

        $signature = $this->base64UrlDecode($base64UrlSignature);
        if (!$signature) {
            return null;
        }

        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, $this->secret, true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payloadJson = $this->base64UrlDecode($base64UrlPayload);
        if (!$payloadJson) {
            return null;
        }

        $payload = json_decode($payloadJson, true);
        if (!$payload) {
            return null;
        }

        // Vérification de la date d'expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private function base64UrlDecode(string $data): ?string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        $decoded = base64_decode(str_replace(['-', '_'], ['+', '/'], $data), true);
        return $decoded === false ? null : $decoded;
    }
}
