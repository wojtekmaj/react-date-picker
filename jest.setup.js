import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

function checkValidityPolyfill() {
  return true;
}

global.HTMLFormElement.prototype.checkValidity = checkValidityPolyfill;
global.HTMLInputElement.prototype.checkValidity = checkValidityPolyfill;
