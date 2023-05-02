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
    ctrl: false,
    selectionStart: 0,
    selectionEnd: 0,
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
    this.elements.area.addEventListener('select', () => {
      this.detectSelection();
    });
  },

  addKeysEvents() {
    this.elements.keys.forEach((key) => {
      switch (key.textContent) {
        case 'Backspace':
          key.addEventListener('click', () => {
            const borders = this.detectSelection();
            const start = borders[0] >= 1 ? borders[0] : 1;
            if (borders[0] === borders[1]) {
              this.properties.value = this.properties.value.substring(0, borders[0] - 1)
                + this.properties.value.substring(borders[0], this.properties.value.length);
              this.properties.selectionStart = start - 1;
            } else {
              this.properties.value = this.properties.value.substring(0, borders[0])
                + this.properties.value.substring(borders[1], this.properties.value.length);
              this.properties.selectionStart = start;
            }
          });

          break;

        case 'Caps':
          key.addEventListener('click', () => {
            this.toggleCapsLock();
            key.classList.toggle('key__toggled', this.properties.capsLock);
          });

          break;

        case 'Enter':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.value = [this.properties.value.slice(0, start),
              '\n', this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
          });

          break;

        case 'Space':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.value = [this.properties.value.slice(0, start),
              ' ', this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
          });

          break;

        case 'Shift':
          key.addEventListener('mousedown', () => {
            this.properties.shift = true;
            if (this.properties.capsLock) {
              this.removeUpperCase();
            } else { this.addUpperCase(); }
          });
          key.addEventListener('mouseup', () => {
            this.properties.shift = false;
            if (this.properties.capsLock) {
              this.addUpperCase();
            } else { this.removeUpperCase(); }
          });

          break;

        case 'Del':
          key.addEventListener('click', () => {
            const borders = this.detectSelection();
            const start = borders[0];
            if (borders[0] === borders[1]) {
              this.properties.value = this.properties.value.substring(0, borders[0])
                + this.properties.value.substring(borders[0] + 1, this.properties.value.length);
              this.properties.selectionStart = start;
            } else {
              this.properties.value = this.properties.value.substring(0, borders[0])
                + this.properties.value.substring(borders[1], this.properties.value.length);
              this.properties.selectionStart = start;
            }
          });
          break;
        case 'Tab':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.value = [this.properties.value.slice(0, start),
              '\t', this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
          });
          break;
        case 'Alt':
          key.addEventListener('mousedown', () => {
            if (this.properties.ctrl) {
              this.changeLanguage();
            }
          });
          break;
        case 'Ctrl':
          key.addEventListener('mousedown', () => {
            this.properties.ctrl = true;
          });
          key.addEventListener('mouseup', () => {
            this.properties.ctrl = false;
          });
          break;
        case 'Win':
          //
          break;
        case '←':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.selectionStart = start - 1;
          });
          break;
        case '→':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.selectionStart = start + 1;
          });
          break;
        default:
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            let value;
            if (this.properties.capsLock) {
              if (this.properties.shift) {
                value = key.textContent;
              } else { value = key.textContent.toUpperCase(); }
            } else if (this.properties.shift) {
              value = key.textContent.toUpperCase();
            } else { value = key.textContent; }
            this.properties.value = [this.properties.value.slice(0, start), value, this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
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
        this.elements.area.value = this.properties.value;
        this.elements.area.focus();
        this.elements.area.selectionStart = this.properties.selectionStart;
        this.elements.area.selectionEnd = this.properties.selectionStart;
      });
    });
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    if (this.properties.capsLock) {
      this.addUpperCase();
    } else {
      this.removeUpperCase();
    }
  },

  addUpperCase() {
    document.querySelectorAll('.key__transformable').forEach((key) => {
      key.classList.add('key__upperCase');
    });
  },

  removeUpperCase() {
    document.querySelectorAll('.key__transformable').forEach((key) => {
      key.classList.remove('key__upperCase');
    });
  },

  detectSelection() {
    return [this.elements.area.selectionStart, this.elements.area.selectionEnd];
  },

  changeLanguage() {
    if (this.properties.language === 'rus') {
      this.properties.language = 'eng';
    } else { this.properties.language = 'rus'; }
    this.saveToLocalStorage();
    this.init();
  },

  saveToLocalStorage() {
    localStorage.setItem('language', this.properties.language);
  },

  loadFromLocalStorage() {
    if (localStorage.getItem('language')) {
      this.properties.language = localStorage.getItem('language');
    }
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.loadFromLocalStorage();
  const info = `<img class="image" src="./assets/fox.png" alt="Fox">
    <h1 class="title">Created by Danil Garmashov</h1>
    <h2 class="hint">You can change the language with the Ctrl+Alt combination!</h2>`;
  document.body.insertAdjacentHTML('beforeend', info);
  Keyboard.initTextArea();
  Keyboard.init();
});

document.onkeydown = (e) => {
  e.preventDefault();
  if (document.querySelector(`[data-key-code="${e.code}"]`)) {
    document.querySelector(`[data-key-code="${e.code}"]`).classList.add('active');
    document.querySelectorAll('.key').forEach((key) => {
      if (key.getAttribute('data-key-code') === e.code) {
        let event = new Event('click', { bubbles: false });
        key.dispatchEvent(event);
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
          event = new Event('mousedown', { bubbles: false });
          key.dispatchEvent(event);
        }
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
          event = new Event('mousedown', { bubbles: false });
          key.dispatchEvent(event);
        }
        if (e.code === 'AltLeft' || e.code === 'AltRight') {
          event = new Event('mousedown', { bubbles: false });
          key.dispatchEvent(event);
        }
      }
    });
  }
};

document.onkeyup = (e) => {
  e.preventDefault();
  if (document.querySelector(`[data-key-code="${e.code}"]`)) {
    document.querySelector(`[data-key-code="${e.code}"]`).classList.remove('active');
    document.querySelectorAll('.key').forEach((key) => {
      if (key.getAttribute('data-key-code') === e.code) {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
          const event = new Event('mouseup', { bubbles: false });
          key.dispatchEvent(event);
        }
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
          const event = new Event('mouseup', { bubbles: false });
          key.dispatchEvent(event);
        }
        if (e.code === 'AltLeft' || e.code === 'AltRight') {
          const event = new Event('mouseup', { bubbles: false });
          key.dispatchEvent(event);
        }
      }
    });
  }
};
