# Kaelor Coach

Kaelor Coach transforma datos de entrenamiento, recuperacion, alimentacion y salud en una decision diaria explicable y segura.

## Empieza aqui

1. [ROADMAP.md](ROADMAP.md): fases, dependencias, riesgos y criterios de salida.
2. [GitHub Issues](https://github.com/abejarano/KaelorCoach/issues): alcance ejecutable de cada feature.
3. [CODEX.md](CODEX.md): reglas globales para ejecutar una feature.
4. `.agents/skills/`: instrucciones especificas de backend, Flutter, Zepp o salud.

## Documentos de referencia

- [Producto](docs/PRODUCT.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Persistencia](docs/PERSISTENCE.md)
- [Frontend y reloj](docs/FRONTEND_GUIDE.md)
- [Estandar de issues](docs/ISSUE_STANDARD.md)
- [Auditoria del proyecto](PROJECT_AUDIT.md)
- [Verificacion](docs/verification.md)

## Harness

```bash
./init.sh
node scripts/sync-github-project.mjs
node scripts/sync-features.mjs
./verify.sh
```

El segundo comando es solo lectura. Usar `--apply` unicamente para normalizar GitHub con credenciales validas.
