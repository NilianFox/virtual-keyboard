// eslint-disable-next-line import/extensions
import keysLayout from './keys.js';

const Keyboard = {
  elements: {
    main: null,
    keys: [],
    area: null,
  },

  properties: {
    language: 'eng',
    value: '',
    capsLock: false,
    shift: false,
  },

  init() {
    // Create main element
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('keyboard');
    this.elements.main.id = 'keyboard';
    this.elements.main.innerHTML = this.createKeys();

    // Add to DOM
    if (document.getElementById('keyboard')) {
      document.getElementById('keyboard').remove();
    }
    document.body.append(this.elements.main);
    this.elements.keys = this.elements.main.querySelectorAll('.key');
    this.addKeysEvents();
  },

  createKeys() {
    let fragment = '';
    keysLayout.forEach((element) => {
      fragment += '<div class="keyboard__row">';
      element.forEach((key) => {
        if (key.size) {
          fragment += `<div data-key-code="${key.code}" style="--key-size: ${key.size}" data-key-display="${key.key}" class="key">${key.key}</div>`;
        } else if (this.properties.language === 'eng') {
          fragment += `<div data-key-code="${key.code}" data-key-display="${key.key}" class="key key__transformable">${key.key}</div>`;
        } else if (this.properties.language === 'rus') {
          fragment += `<div data-key-code="${key.code}" data-key-display="${key.keyRu}" class="key key__transformable">${key.keyRu}</div>`;
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
    this.elements.area = document.querySelector('.textarea-input');
  },

  addKeysEvents() {
    this.elements.keys.forEach((key) => {
      switch (key.textContent) {
        case 'Backspace':
          key.addEventListener('click', () => {
            this.properties.value = this.properties.value
              .substring(0, this.properties.value.length - 1);
          });

          break;

        case 'Caps':
          key.addEventListener('click', () => {
            this.toggleCapsLock();
            key.classList.toggle('key--toggled', this.properties.capsLock);
          });

          break;

        case 'Enter':
          key.addEventListener('click', () => {
            this.properties.value += '\n';
          });

          break;

        case 'Space':
          key.addEventListener('click', () => {
            this.properties.value += ' ';
          });

          break;

        case 'Shift':
          key.addEventListener('mousedown', () => {
            this.properties.shift = true;
            this.toggleUpperCase();
          });
          key.addEventListener('mouseup', () => {
            this.properties.shift = false;
            this.toggleUpperCase();
          });

          break;

        case 'Del':
          //
          break;
        case 'Tab':
          //
          break;
        case 'Alt':
          //
          break;
        case 'Ctrl':
          //
          break;
        case 'Win':
          //
          break;
        case '↑':
          //
          break;
        case '→':
          //
          break;
        case '←':
          //
          break;
        case '↓':
          //
          break;
        default:
          key.addEventListener('mousedown', () => {
            this.properties.value += this.properties.capsLock
              ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
          });
          break;
      }
      key.addEventListener('mousedown', () => {
        key.classList.add('active');
      });
      key.addEventListener('mouseup', () => {
        key.classList.remove('active');
      });
      key.addEventListener('click', () => {
        this.elements.area.textContent = this.properties.value;
      });
    });
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this.toggleUpperCase();
  },

  toggleUpperCase() {
    document.querySelectorAll('.key__transformable').forEach((key) => {
      key.classList.toggle('key__upperCase');
    });
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.initTextArea();
  Keyboard.init();
});

window.onkeydown = (e) => {
  document.querySelector(`[data-key-code="${e.code}"]`).classList.add('active');
};

window.onkeyup = (e) => {
  document.querySelector(`[data-key-code="${e.code}"]`).classList.remove('active');
};
