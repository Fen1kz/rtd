import webpackConfig from '../../webpack.client.babel';
import frontendDevelopment from './frontend.development';

export default () => frontendDevelopment(webpackConfig)