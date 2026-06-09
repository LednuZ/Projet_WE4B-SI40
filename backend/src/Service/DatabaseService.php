<?php

namespace App\Service;

use PDO;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class DatabaseService
{
    private ?PDO $connection = null;
    private string $dsn;
    private string $user;
    private string $pass;

    public function __construct(
        #[Autowire(env: 'DATABASE_URL')]
        string $databaseUrl
    ) {
        $url = parse_url($databaseUrl);
        $dbName = ltrim($url['path'], '/');
        $this->dsn  = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            $url['host'],
            $url['port'] ?? 3306,
            $dbName
        );
        $this->user = $url['user'] ?? 'root';
        $this->pass = $url['pass'] ?? '';
    }

    public function getConnection(): PDO
    {
        if ($this->connection === null) {
            $this->connection = new PDO($this->dsn, $this->user, $this->pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        }
        return $this->connection;
    }
}
