export const dropdownSelect = {
    init: (label, value, fn) => {
        const activeItem = document.querySelector(`#${label}.dropdown_select #item-${value.toString()}.dropdown_select-item`);
        if (activeItem)
            activeItem.classList.add('active');
        (document.querySelectorAll(`#${label}.dropdown_select .dropdown_select-item`)).forEach(element => {
            element.addEventListener('click', () => {
                document
                    .querySelectorAll(`#${label}.dropdown_select .dropdown_select-item`)
                    .forEach(element => element.classList.remove('active'));
                element.classList.add('active');
                fn(element.id.replace('item-', ''));
            });
        });
        document.querySelector(`#${label}.open_dropdown_select`).addEventListener('click', () => {
            document.querySelector(`#${label}.open_dropdown_select`)?.classList.toggle('active');
            document.querySelector(`#${label}.dropdown_select`).classList.toggle('open');
        });
        const eventFn = (e) => {
            if (!document.querySelector(`#${label}.dropdown_select`))
                return;
            if (e.target.closest(`#${label}.dropdown_select`) ||
                e.target.closest(`#${label}.open_dropdown_select`))
                return;
            document.querySelector(`#${label}.open_dropdown_select`).classList.remove('active');
            document.querySelector(`#${label}.dropdown_select`).classList.remove('open');
        };
        document.removeEventListener('click', eventFn);
        document.addEventListener('click', eventFn);
    },
    html: (label, _value) => {
        const list = dropdownSelect.list[label];
        return `
			<div class="open_dropdown_select editbar_button Noteworthy_tooltip" id="${label}">
			<span class="tool_tip_text">${label.split('-').join(' ')}</span>
				${dropdownSelect.icon[label]}
			</div>
            <div class="dropdown_select" id="${label}">
				<div class="dropdown_select-list">
						${Object.keys(list)
            .map(key => {
            return `<div class="dropdown_select-item" id="item-${key}">${list[key]}</div>`;
        })
            .join('')}
				</div>
            </div>
        `;
    },
    list: {
        'line-Start': {
            none: '<img src="data:image/png;base64,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" />',
            arrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 50 0 L 100 100 L 0 100 Z" /></svg>',
            arrow2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 0 0 L 100 0 L 50 100 Z" /></svg>',
            dot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>',
            dot2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" /></svg>',
        },
        'line-End': {
            none: '<img src="data:image/png;base64,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" />',
            arrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 50 0 L 100 100 L 0 100 Z" /></svg>',
            arrow2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M 0 0 L 100 0 L 50 100 Z" /></svg>',
            dot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>',
            dot2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" /></svg>',
        },
        width: {
            '1': '1px',
            '2': '2px',
            '3': '3px',
            '4': '4px',
            '6': '6px',
            '8': '8px',
            '12': '12px',
            '16': '16px',
            '24': '24px',
        },
        radius: {
            '0': 'none',
            '3': '3px',
            '5': '5px',
            '10': '10px',
            '15': '15px',
        },
    },
    icon: {
        width: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAAk0lEQVR4nO3ZQQqAMAwAQfX/f9YP2INiYSsz90Lo3pJtAwAAAAAAAADu7C/enJ9P8W+P/viYNQXvCBIjCAAAAMCQbe98tr0rEyRGkBhBYgQBAAAAGHIPmc89ZGWCxAgSI0iMIDGCxAgCAAAAMORiOJ+L4coEiREkRpAYQWIEiREkRpAYQWIEiREEAAAAAAAAAFjCBY9+BDlQi9Q/AAAAAElFTkSuQmCC"/>`,
        radius: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAC9ElEQVR4nO3bvWsUQRjH8W9yKpynNiooeAoWJiQGEQUrCwtLBbHTP8BGtFew0UYExT9AK/GNiGIXwbdOC4sIFoIIYhE5TWJikRhMYrGbJlxm57nszWx2fx+YJvPc8OxOdvbu2R0QERERERERERFxawLDwHTangJ9EeMHgefAFDAHTABfgQ/AfeAKcBrY7j6staEJjAOLy9pE2hc6fgj40ya+XVsARoEbwEHLQRfJMCsf4OMI8S8c8VntI3ARaHgffQFMs/IBTQWOr5EsOZ1OwFL7CVwGtvifhnhcJ+h34Pi8JmCpjQFngR7fk7FavR185qWjbyRw/DzwxhFvtQO4l+awO8dxc9VHckNc/t/zC9gVId5yE7a0ceCEx/mIoklyQ5xK2yPan5xQ8QPAM2CSfCdhAbhKF5ekYGtdQOuBTcBWYC/QDxwBjgE7OxzzLnAO+JdHglV2CLgFtLBfDU+AdeFTLqc6cB74hm0S7lDOVSOaOskaP4v/JFyLkmnJDQKf8L8xn4yTZrk1gIf4f0XdEyfNcusFbuM3Ca/Q/aBrbuI3CWdiJVh2vfgtR2OskQLeWtTA78Z8KVaCVbCf7K+oLVbxPKG2+hxLrUXyW+GoI6aRxr0PklEFbQS+474KRqNlVxEXyL4XHIiWXQXUyS7gXe9k4E6eiFXRDPAgI+Z4iESq7DDuK2Ce5BmEdEkP8AP3JJyyDqolyN8i8DojZtA6qCbA5l1Gf791QE2AzeeM/n3WATUBNl8y+rdZB9QE2Exm9G8OkkWFbcD9LWjWOqCuAJs52r9QvGTGOqAmwO6toy/P91RlBQO0fxd1Ou2TAIZI3tT+m7aR9G8SWA091BIRqRrrPmbJkXUfs+TMuo9Zcmbd9+ykUkS+Fq0f0ATYWfc9S86s+5ilC6z7mEVERCQnqgVFpFpQZKoFRaZaUIGpFhSAakGRqRZUAKoFiYiIRKJaUESqBUWmWlBkqgUVmGpBAagWFJlqQQWgWpCIiIiIiIiIiJj9BxrGJpta47mDAAAAAElFTkSuQmCC">`,
        'line-Start': `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAADYElEQVR4nO2dO2sUURiGn2TxfkcUL4iiiNfgBUGsxMpOO0s7a/0DgpDGwkaQVNoJgqAYA6JEkIgIIigoIooiiigKBmOiuUm02BkTkrg5szs78+7s+8BXzcw573ee3WU4szBgjCk+p6MyOdMCnAP+RHUBaM01URNTAi4xLiOuy8CsHHM1JXOAa0yVEVcXMC+3dE3GQqCb/8uIqwdYklPGpmEl8ISZZcT1HFiTS9ImYD3winAZcb0FNuWQt9BsAz6QXEZcn4C2zFMXlH3AV6qXEVcvcCDj7IXjENBH7TLiGgAOZ9pBgTgKDJKejLiGgWMZ9lEIjgOjpC8jrt/Aicy6aXBOAmPUT0ZcY8CZjHpqSFqAs9RfxOQ6H81tJlACLpLsjimNc+K6GGUwwGzgKuGL9xnYFXDeduBjgnE7gbl17lWeBcAdwhftHbA5unamcwE2AK8TjH8PWFynXuVZBjwkfLFeAGsnXB8iBGAV8DTBPI+BFSn3Ks9q4Bnhi/QIWD5pjFAhAEuBBwnmewmsS6lXeTYCbwhfnLvAomnGSSIEYD5wK8G874EtNfYqz17gC+GLcp3yw6jpSCoEyjcQVxLM/w3YX2Wv8mwl2a1oB5Wfj1cjhGjMjgQ5einoN6WL8EVoDxivWiEx7Qny3AwYr6EoEbZROAacChyzViFEc4Vs0/yiYP9maQVGqNz0KOVNxVDSEAJhG5kjFHB7pdIfEwaBIwnHS0sI0dyVvsHdCcdrCHYDP5nabB9wsIrx0hRClGG6h2EDUfZCsofyVskQ5U/kDca3QpKSthCiLJ1RtqEoa6Yy8vpdbKH6RYuZ6fpae0sjY1WTNir1FpILhbqVKwIWIoaFiGEhYliIGBYihoWIYSFiWIgYFiKGhYhhIWJYiBgWIoaFiGEhYliIGBYihoWIYSFiWIgYFiKGhYhhIWJYiBgWIoaFiGEhYliIGBYihoWIYSFiWIgYFiKGhYhhIWJYiBgWIoaFiGEhYliIGBYihoWIYSFiWIgYFiKGhYhhIWJYiBgWIoaFiGEhYliIGBYihoWIYSFiWIgYFiKGhYhhIWJYiBgWIkYjC/lR4dj3zFKkTCML6alw7H5mKcw/dgD9TH3VUX90zORAG+X3RI0Aw8BtYGeuiQxQfnFlKe8QpoD8Ba0DcBMWg6ehAAAAAElFTkSuQmCC" />`,
        'line-End': `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAABGklEQVRoge3a22rCQBhF4aUP2IhUvGjfXZQesO0bWIgXyaCOM4ngGJPNXhDwYsz8H0lAIeBc6SrgB9gDL0+eZZA+gbo9PobefDb0hjTQp80wH3KzMWSwegarZ7B6BqtnsHoGq2ewegarZ7B6BqtnsHoGq2ewegarZ7B6BqtnsHoGq2eweiXBK+CP5sWzRYHzVcAG2LWfR9UM+OX0ht0BWGfW1tGRat2eI6z5KjlsqfZcQnLoPnCMrYHtA+a9uyXXg6bQXeAU9sAIb+nQK9cD/wPvZ2ty4FXmu28Pn/rO+tAp8GSxoS50DJ48NpR7HmPwLc/9ZEpd6a5jklc27la0BDbUh5bChnJoSWwoRktjQxXNb+NvyvzJcO6sI0jMoElnW3iPAAAAAElFTkSuQmCC" />`,
    },
};
