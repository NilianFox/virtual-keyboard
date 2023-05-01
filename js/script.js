// eslint-disable-next-line import/extensions
import keysLayout from './keys.js';

const Keyboard = {
  elements: {
    main: null,
    keys: [],
  },

  properties: {
    language: 'rus',
    value: '',
    capsLock: false,
  },

  init() {
    // Create main element
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('keyboard');
    this.elements.main.id = 'keyboard';
    this.elements.main.innerHTML = this.createKeys();

    // Add to DOM
    document.body.append(this.elements.main);
  },

  createKeys() {
    let fragment = '';
    keysLayout.forEach((element) => {
      fragment += '<div class="keyboard__row">';
      element.forEach((key) => {
        if (key.size) {
          fragment += `<div data-key-code="${key.code}" style="--key-size: ${key.size}" data-key-display="${key.key}" class="key"></div>`;
        } else if (this.properties.language === 'eng') {
          fragment += `<div data-key-code="${key.code}" data-key-display="${key.key}" class="key"></div>`;
        } else if (this.properties.language === 'rus') {
          fragment += `<div data-key-code="${key.code}" data-key-display="${key.keyRu}" class="key"></div>`;
        }
      });
      fragment += '</div>';
    });
    return fragment;
  },

  initTextArea() {
    const area = `<div class="textarea">
                      <textarea class="textarea-input"></textarea>
                  </div>`;
    document.body.insertAdjacentHTML('beforeend', area);
    document.querySelector('.textarea-input').value = this.properties.value;
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.initTextArea();
  Keyboard.init();
});

window.onkeydown = (e) => {
  console.log(document.querySelector(`[data-key-code="${e.code}"]`), e);
  document.querySelector(`[data-key-code="${e.code}"]`).classList.add('active');
};

window.onkeyup = (e) => {
  document.querySelector(`[data-key-code="${e.code}"]`).classList.remove('active');
};
