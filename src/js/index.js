import sayHello from '@js/sayHello';
import styleSCSS from '@styles/sample';

if (module.hot) {
  module.hot.accept();
}
console.log(sayHello());
