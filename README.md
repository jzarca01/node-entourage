# node-entourage

Une API pour Entourage

## Usage

```javascript
const Entourage = require('node-entourage');
const entourage = new Entourage({
  apiKey: ''
});
```

### Authentification

```javascript
entourage.login(phoneNumber, code);
```
