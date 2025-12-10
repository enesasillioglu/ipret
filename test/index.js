const test = require('tape');
const ipret = require('../src/ipret');

const strings = {
  'Current password': 'Şimdiki şifre',
  'New password': 'Yeni şifre',
  'Change Password': 'Şifreyi Değiştir',
  'Updated {0}': '{0} güncellendi',
  password: 'şifre',
};

test('setLanguage throws language not defined error', (t) => {
  t.plan(1);
  t.throws(
    () => {
      ipret.setLanguage('tr');
    },
    /Error/,
    'Language should be defined before set',
  );
});

test('setStrings is there and sets default language', (t) => {
  t.plan(3);
  t.equal(typeof ipret.setStrings, 'function', 'setStrings function should be defined');
  ipret.setStrings('tr', strings);
  t.equal(typeof ipret.getLanguage, 'function', 'getLanguage function should be defined');
  t.equal(ipret.getLanguage(), 'tr', 'Default language is set for first setStrings call');
});

test('getLanguages', (t) => {
  t.plan(2);
  t.equal(typeof ipret.getLanguages, 'function', 'getLanguages function should be defined');
  t.equal(ipret.getLanguages()[0], 'tr', 'Returns all languages');
});

test('translate', (t) => {
  t.plan(2);
  t.equal(typeof ipret.translate, 'function', 'translate function should be defined');
  t.equal(ipret.translate('Updated {0}', 'password'), 'şifre güncellendi', 'Translation with string format should be supported');
});

test('setup enhanced translations', (t) => {
  t.plan(1);

  ipret.setStrings('en', {
    'Floor {0}': 'Floor {0}',
    'Floor {0} is not valid': 'Floor {0} is not valid',
    GREETING: 'Hello {{name}}!',
    USER_INFO: '{{firstName}} {{lastName}} is {{age}} years old',
    FLOOR_ROOM: 'Floor {0}: {{roomName}}',
    MIXED_TEST: '{0} has {{count}} items in {{location}}',
  });

  ipret.setStrings('tr-TR', {
    'Floor {0}': 'Kat {0}',
    GREETING: 'Merhaba {{name}}!',
    USER_INFO: '{{firstName}} {{lastName}} {{age}} yaşında',
  });

  ipret.setLanguage('en');
  t.equal(ipret.getLanguage(), 'en', 'Language set to en');
});

test('positional parameters (ipret format)', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(ipret.translate('Floor {0}', 5), 'Floor 5', 'Single positional parameter');
});

test('multiple positional parameters', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(ipret.translate('Floor {0} is not valid', 10), 'Floor 10 is not valid', 'Positional parameter in longer string');
});

test('named parameters (ngx-translate format)', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(ipret.translate('GREETING', { name: 'World' }), 'Hello World!', 'Single named parameter');
});

test('multiple named parameters', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(
    ipret.translate('USER_INFO', {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    }),
    'John Doe is 30 years old',
    'Multiple named parameters',
  );
});

test('mixed positional and named parameters', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(ipret.translate('FLOOR_ROOM', 5, { roomName: 'Kitchen' }), 'Floor 5: Kitchen', 'Mixed positional and named parameters');
});

test('complex mixed parameters', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(ipret.translate('MIXED_TEST', 'User', { count: 42, location: 'cart' }), 'User has 42 items in cart', 'Complex mixed positional and named parameters');
});

test('language switching (Turkish)', (t) => {
  t.plan(3);
  ipret.setLanguage('tr-TR');
  t.equal(ipret.getLanguage(), 'tr-TR', 'Language switched to Turkish');
  t.equal(ipret.translate('Floor {0}', 3), 'Kat 3', 'Turkish translation with positional');
  t.equal(ipret.translate('GREETING', { name: 'Dünya' }), 'Merhaba Dünya!', 'Turkish translation with named params');
});

test('fallback to key (untranslated)', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(ipret.translate('UNTRANSLATED_KEY', { test: 'value' }), 'UNTRANSLATED_KEY', 'Returns key when translation not found');
});

test('direct string with named params (no translation)', (t) => {
  t.plan(1);
  ipret.setLanguage('en');
  t.equal(ipret.translate('Hello {{name}}', { name: 'Direct' }), 'Hello Direct', 'Direct string interpolation with named params');
});
