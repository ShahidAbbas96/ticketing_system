import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://retailapi.fbr.heelsshoes.pk:7059/api'
};
