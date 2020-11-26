import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

function checkValidityPolyfill() {
  return true;
}

global.HTMLFormElement.prototype.checkValidity = checkValidityPolyfill;
global.HTMLInputElement.prototype.checkValidity = checkValidityPolyfill;
