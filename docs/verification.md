# Verification — Kaelor Coach

## 1. Regla

No inventar comandos. Leer primero los archivos reales de configuración de cada app.

## 2. Arnés

```bash
./init.sh
```

Valida únicamente estructura y archivos de gobernanza.

## 3. Verificación runtime

Cuando el runtime exista, `verify.sh` deberá ejecutar únicamente scripts reales detectados.

Objetivo futuro:

```text
API: lint, typecheck, tests relevantes
Flutter: analyze, tests relevantes
Watch: lint/build según toolchain Zepp
Side service: lint/build/test según proyecto
```

## 4. Evidencia requerida

Todo informe `progress/impl_*` debe listar:

- comandos ejecutados;
- resultado;
- pruebas manuales;
- limitaciones;
- deuda preexistente no causada por la feature.
