# Threat model

NUUL is a local-first safe export studio. It is designed to reduce common accidental leaks in screenshots before sharing.

## Protects against

- Accidental sharing of EXIF metadata.
- Visible contact details like emails and phone numbers.
- QR codes that encode links or identifiers.

## Does not protect against

- Face search or reverse image search against large datasets.
- Adversaries correlating the scene content with external datasets.
- Unique objects or background elements that identify the source.
- Determined attackers with access to additional data.

Always review your export before sharing.
