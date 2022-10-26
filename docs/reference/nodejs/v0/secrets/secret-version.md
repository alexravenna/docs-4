---
title: secret.version()
description: Returns a reference to a known version of a secret.
---

Returns a reference to a known version of a secret.

```javascript
import { secret } from '@nitric/sdk';

const keyRef = secret('encryptionKey').for('access');

const keyVersionRef = keyRef.version('the-version-id');
```

## Parameters

---

**version** required `string`

The version id. This value is returned from [secret.put()](./secret-put)

---

## Examples

### Return a reference to a known secret version

```javascript
import { secret } from '@nitric/sdk';

const keyRef = secret('encryptionKey').for('access');

const keyVersionRef = keyRef.version('the-version-id');
```

## See Also

- [secret.version().access()](./secret-version-access)