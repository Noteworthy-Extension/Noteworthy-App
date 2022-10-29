export const colorPicker = {
	init: (label: string, value: string, fn: (newVal: string) => void) => {
		console.log('VALUE: ', value);
		const activeColor = document.querySelector(
			`#${label}.color_picker [style*="background-color: ${value}"].color_picker-color`
		);
		if (activeColor) activeColor.classList.add('active');
		(<NodeListOf<HTMLElement>>(
			document.querySelectorAll(`#${label}.color_picker .color_picker-color`)
		)).forEach(element => {
			element.addEventListener('click', () => {
				document
					.querySelectorAll(`#${label}.color_picker .color_picker-color`)
					.forEach(element => element.classList.remove('active'));
				element.classList.add('active');
				// document.querySelector(`#${label}.color_picker`)?.dispatchEvent(new CustomEvent('newVal', {detail: element.style.backgroundColor}));
				console.log('newVal', element.style.backgroundColor);
				(<HTMLElement>(
					document.querySelector(`#${label}.open_color_picker .color_picker-color_display`)
				)).style.backgroundColor = element.style.backgroundColor;
				fn(element.style.backgroundColor);
			});
		});

		(<HTMLElement>(
			document.querySelector(`#${label}.color_picker .custom_color_input`)
		)).addEventListener('change', e => {
			const color = colorPicker.hexToRgb((<HTMLInputElement>e.target).value);
			(<HTMLElement>(
				document.querySelector(`#${label}.open_color_picker .color_picker-color_display`)
			)).style.backgroundColor = color;
			document
				.querySelectorAll(`#${label}.color_picker .color_picker-color`)
				.forEach(element => element.classList.remove('active'));
			const activeColor = document.querySelector(
				`#${label}.color_picker [style*="background-color: ${color}"].color_picker-color`
			);
			console.log('activeColor', activeColor);
			if (activeColor) activeColor.classList.add('active');
			fn(color);
		});

		document
			.querySelector(`#${label}.color_picker .color_picker-transparent`)
			?.addEventListener('click', () => {
				document
					.querySelectorAll('.color_picker-color')
					.forEach(element => element.classList.remove('active'));
				(<HTMLElement>(
					document.querySelector(`#${label}.open_color_picker .color_picker-color_display`)
				)).style.backgroundColor = 'rgb(0, 0, 0, 0)';
				fn('rgb(0, 0, 0, 0)');
			});

		(<HTMLElement>document.querySelector(`#${label}.open_color_picker`)).addEventListener(
			'click',
			() => {
				document.querySelector(`#${label}.open_color_picker`)?.classList.toggle('active');
				(<HTMLElement>document.querySelector(`#${label}.color_picker`)).classList.toggle('open');
			}
		);

		const eventFn = (e: MouseEvent) => {
			if (!document.querySelector(`#${label}.color_picker`)) return;
			if (
				(<HTMLElement>e.target).closest(`#${label}.color_picker`) ||
				(<HTMLElement>e.target).closest(`#${label}.open_color_picker`)
			)
				return;
			(<HTMLElement>document.querySelector(`#${label}.open_color_picker`)).classList.remove(
				'active'
			);
			(<HTMLElement>document.querySelector(`#${label}.color_picker`)).classList.remove('open');
		};
		document.removeEventListener('click', eventFn);
		document.addEventListener('click', eventFn);
	},

	rgbToHex: (rgb: string): string => {
		const rgbParse = rgb.replace('rgb(', '').replace(')', '').split(',');
		const r = parseInt(rgbParse[0]);
		const g = parseInt(rgbParse[1]);
		const b = parseInt(rgbParse[2]);
		const componentToHex = (c: number) => {
			const hex = c.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};
		return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
	},

	hexToRgb: (hex: string): string => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
			: 'rgb(0, 0, 0, 0)';
	},

	html: (label: string, value: string) => {
		return `
		<div class="open_color_picker editbar_button Noteworthy_tooltip" id="${label}">
			<span class="tool_tip_text">${label}</span>
		    ${colorPicker.icon[label]}
			<div style="background-color: ${value}" class="color_picker-color_display"></div>
		</div>
        <div class="color_picker Noteworthy_edit_bar_dropdown" id="${label}">
            <div class="color_picker-color_wrapper">
    ${colorPicker.colors
					.map(color => {
						return `<div class="color_input_wrapper">
									<div class="color_picker-color" style="background-color: ${color};"></div>
                                </div>`;
					})
					.join('')}
            </div>

            <div class="color_picker-input_wrapper">
				<div class="custom_color_wrapper">
					<img class="custom_color_image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAADo0lEQVR4nO2cPWsUQRiAnzPgRY2iIKYTQWxV0B8gCH5gCj9RtBL8D7EJBBUj2gREJYKirXYWwUQIWKiNhYq10cKIxg/QxIsKOYu5hfPcyc3ezs7O3LwPvE2yOzPvw5s3u7N3C4IgCIIgCIIgCJ5SKXsBJbIG2AscALYB/cB64DPwEXgBjAMTwPeS1hg064BhlLy6QcwDlxrnCYYcAr5hJrg1vgIH3S85LCrAELBIZ5KTWGyME3PL1VIBrpJPcGsMOc0gAIqQnFT2MYd5eE0FuIZ9yc09e62zbDylqEpujQuuEvKRoiu5OeaA1W7S8gtXldwcR5xk5hEuK7k5brtIzhfKqOQknjvIzykrgDFUX5wFLgNVyqvkJN4XmXQZjPF/kuPAjZSfu4yFIpN2TQX4QblCc1X0so5Td0uSlI98MDkoFNEAt8pegIaXZS/ANlVUTy67VbTGYZPFh1TRPjIHPCp7ETZZDjyg/OptjfNFJu0aX1vGF7po987XSl4EjhaYt1NMKnnc4JgiomuesJhKrhoeazOu0yXPDE3axUOgN+M5NuImXXKl1onkLOeKZPJJzjKGSCaf5CxjiWRNmErOMqap5Gj/8dkcWySTT3KWOUQy+SRnmasrJWe5GXE5Zx31WEwkFzxvUXM7x3fJSYxant8poUiuox4CB9k+QpJcB2oEeIPis2TdFmtwH/HyXXKyxTqKahc1lOQ+y+splBAkN1MhwL7s8mbEh3lLQSQ7ILR2ESQ9wD2kkgvnClLJhbOHpb+RKpIt0AO8RtpF4ZxBn+wT7CcbXSWD2g94S3qy08AGy/NFKRlgN/qE91meK8p2kXCH9ISnLM8TbSWDahuzpCd93OI8UVcywE7Sk54HVlqaI+pKTjhLeuITlsYXyQ0mSU9+0MLYIrlBH/CTdAFbc44tkps4RbqANznHFcktPCZdwnCOMXsRyf8wQLqE38DGDsfsB55qxo1Scj/wjnQRnT45HlhizCglV9FX3QKwOcNYq4CT6FtQtJJBvZtTJ8PkTVnbUZd+k+ivWKKXDOpVCWkyauhfjroJOEf71pAW94lQMsAM5pW3BbgL/FniHF0sAiME+JEsW4zQ/s98HXAR+NXmWF28Qm29Ro3JzUStze91MQ2cJuIqbsXmV4E/oS4JdyGCU+lU9jxqZ28Q2IHINSKL7CngBPb2qKOjnexpYH9pq+sydI+ZnqFu1wWLVFGXfjONGCHSGw1BEARBEARBEIRg+Qu1rrjZLBV7VQAAAABJRU5ErkJggg==" />
					<input type="color" id="${label}" class="custom_color_input" value="${colorPicker.rgbToHex(
			value
		)}" />
				</div>

                <button class="color_picker-transparent">
					<img src="data:image/png;base64,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" />
					<p>Transparent</p>
				</button>
            </div>
        </div>
        `;
	},

	icon: {
		fill: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAEsUlEQVR4nO2cT6hVRRzHP+9dn/9NJa9/Fpq1sVxEQuIiKKylYC+xpYt2LQwCA0Fp5UZK7c8mFIS0UAKDQEsNMUJFkETtRfgkXZiZSgn5p3zv1avF3CtXu++c38yZMzP33N8HZnXvmfnO93vn3HNm5hxQFEVRFEVRlK6lJ7aAbmY9sBeoxRbSjawH/m0UDSEwreZrCIFpZ76GEIgs8zWEkllNvvnN8jHQG0dmdakBnyIPQUdCCWgICaAhJICGkAAaQgLYhnAMDcE7tiGcQEPwjoaQABpCAriEMC6K0gpTA06jIURDMmGnIZSEi/kagic24W6+hlCAHuA9ipuvITjQA3yIP/M1BAt6gZ3ITT0L3LT4/jE0hDGpYVa9pGZ+BzwKzAJ+tzhOR0IbasAnyE08DjzScryGUIDxwOfIzfsWmNamHg3BgQnAF8hNOwhMyqhPQ7BgMvA1crMOABMF9WoIAqYAR5Cb9BnQZ1G/hpDBVOAb5Obswc0cDaENM4CTyE3ZQbHNWBpCCzOBU8jN+Ag/O+Hq2N2s7fHQZnLMBs4hN+Edz+3bjIRh4BXP7UdlDjCA3PzNJenoyhDmAxeQm/92yXq6KoTHgJ+QdXYUeDOQrq4IYSFwCbn5awPrq3QIi4AryDr3N/BaHJnUgTMCjR0VwlPAL8jNXxNH5n1mYqa1KxHC48ANZJ0ZAvrjyPwfs5BfIg8DK+PIzGYa8D2yTtwjvU7YjIQ/gaVxZI7NdmTi7wAvRdKYh81I+BkzrZIEi4AR8kXfBpZH0ijFZiT4vlt3Zgf5Ym8Cy2IJtEQ6Eu4B8yJpvE8vcI1sob8BS2IJdEQawuuxBDZ5mnyRL0ZTV4w6cJHsvh2Ipq7BCrIFnownzQsvk92/Qd8N2s6/13M+P+8qJBGO5nwe/T+gH9kVQ1XLreIWPojtCLjqW0CH8avvCm0DOIe5vu9WLviu0DaAIeCQbxEdxP7YAgBeIP65OEb5C5jrwT8v7Ce+IaFLWWvXTixEPhVdhXIZmO7FOY88h5kfiW1O2SXJ6egmqzCLFrFNKqvkLci82ihRqWoIeUuSdcxp+Ab5MwSls4JqnY4k68G7W76/y8qtkqhKCBLzn8dsr2keM0ois8CdHoLE/PHAj22OHcQ8ARSdTg1Bug1lY0YdGyx8KpVO+2OWmr8AuJtRz93Gd5KgU0aCzQYsyaO1u8UOBSD1EGzMfwb4R1DnKPCs2KEApBqC7dbDryzq/tKi3iCkFoKt+Ut48LJTUpIaBWA6nMIfs8um230O7eyzbCMIsUeCi/lzcPvhjJDQ+kErsUJw3W7+VoE21zm0F4TQp6NhzL2JCzZP+D9cjji2GYRQIRQxH+B6gbavF2g3CGWfjnw85XKrQPt/FGw7CGWNhKK//CY/FNAw4KH9IPgeCT6f79pWQMe7njQEwddI8PXLb7IY84ChrY4R4EmPOoKwCtnTN2OVIfya3+QDBy3bStARhH7M9kfbDl/D7NQogz7s3vZ1GLsXTiXHfMwrLSWzj8OYV92UfdfZB7xP9ggdwfzyO9r8Vp7AvFPiMGbJ706jDGJmJ98g/ALIYmAr5grndqMMAFswD64riqIoiqIoiqJk8h88IGmks2OglwAAAABJRU5ErkJggg==" />`,
		stroke: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAADbUlEQVR4nO2cPYwNURSAv5VsLA0KVoRCVlDTKMSiVYmKQkI0EomGSETYlfjZSiEiWiqNEImIUBF5bEKjsRKh3fW/P2RljWLeyNu373lz39y/M3O+5FRv3p17vpycO3NnMqAoiqIoiqLYpx84D4wCE/UYBYbrvykWOARMAUmbmKwfoxTgLO0FN8dQoDmK5xT5JWdxOchMBdONZJVtSBHJKjsnNiSr7A7YlKyy2+BCsspuwqXkLEa8ZRMpPiRXXrZPyZWVHUJy5WSHlFwZ2TFILr3sc4SX2xzDTjMOQIySsyjNFusQ4WX+L6YowcODmCu5MUTvZUuRnAAvHDlwTuztojkm3GhwizTJCTDuxIRDJLWLxqi5kOEKqZIT0ofAIpDYLrKYBFbZV2IfyZIT4LB9JfaR3C6S+vyjR3olq2QPoZI9hJHkRSYHW+ZnwHMXZQhhW6MxbeCXql20QpJssZIzJMgWIXkwxzExL44i9pkzgXleqYqxskVUcnOVSpMtUrI02aIlS5EtQnLeDaI8C0yIBVLEwncE+0n5lC1C8hpgGvPkYmkjItoFwEXcVpLLyhZRyRmvcZ+sC9miJAN8x0/SNmWLkwzwDTvJ++rZYnpyM6/wW2lFKltkJWdcwH/v7Ea2aMmQXt7NELds8ZIzjmJXtE3ZpZEMcBr7ohOKL5BiF75WrMTelYdN2aWSDHANd5K7lV06yZuAWdyLNunZperJGXfxI9mkskvHDvxKrqTsHuA5YURXSvZ+wkmujOzFwHvCi06AnY5zDcoJwgtOKOElXCMrgM+oZOdcQSU7Zz3wC5XsnNuoZOdsA/5gV9wscBU4hn52+B/PsCv5DrCxYfzVpB/SrgGfSBfcyn1Iex/2BL8k3zvTlaMXGKO44I/AQdJbd6UFxykm+AvpPnGf74lLYjnpBz+6XehukD59UTowQneS7wMDAeYrkrWYv0JQA7aHmKxkbpFf8Ftgr8HYfcBJ4KvBOWKLaeAhsMEg7wVsBeZynGyc9GajN+e4PcAB4IOFRGOJd8CSnPkv4HGHwWeAS8AygzEHSW9AQotxEbsNPMyj3cbRHHATWGcw1mbgnuNEQ8cuAx/zeNpisCfAFoMx+oHrwG8PiYaMMQq0jgHgEWllvwH2GPx3KXAG+OEp0VAxBTyg4GKoKIqiKIpij78usGEcq04/qwAAAABJRU5ErkJggg==" />`,
	},

	colors: [
		'rgb(0, 0, 0)', //Black
		'rgb(67, 67, 67)', //Dark Gray
		'rgb(102, 102, 102)', //Gray
		'rgb(153, 153, 153)', //Light Gray
		'rgb(183, 183, 183)', //Very Light Gray
		'rgb(204, 204, 204)', //Almost White
		'rgb(217, 217, 217)', //White
		'rgb(239, 239, 239)', //White
		'rgb(243, 243, 243)', //White
		'rgb(255, 255, 255)', //White
		'rgb(152, 0, 0)', //Dark Red
		'rgb(255, 0, 0)', //Red
		'rgb(255, 153, 0)', //Orange
		'rgb(255, 255, 0)', //Yellow
		'rgb(0, 255, 0)', //Green
		'rgb(0, 255, 255)', //Cyan
		'rgb(74, 134, 232)', //Blue
		'rgb(0, 0, 255)', //Dark Blue
		'rgb(153, 0, 255)', //Purple
		'rgb(255, 0, 255)', //Magenta
		'rgb(230, 184, 175)', //Skin
		'rgb(244, 204, 204)', //Light Skin
		'rgb(252, 229, 205)', //Light Skin
		'rgb(255, 242, 204)', //Light Skin
		'rgb(217, 234, 211)', //Light Green
		'rgb(208, 224, 227)', //Light Blue
		'rgb(201, 218, 248)', //Light Blue
		'rgb(207, 226, 243)', //Light Blue
		'rgb(217, 210, 233)', //Light Purple
		'rgb(234, 209, 220)', //Light Purple
		'rgb(221, 126, 107)', //Brown
		'rgb(234, 153, 153)',
		'rgb(249, 203, 156)',
		'rgb(255, 229, 153)',
		'rgb(182, 215, 168)',
		'rgb(162, 196, 201)',
		'rgb(164, 194, 244)',
		'rgb(159, 197, 232)',
		'rgb(180, 167, 214)',
		'rgb(213, 166, 189)',
		'rgb(204, 65, 37)',
		'rgb(224, 102, 102)',
		'rgb(246, 178, 107)',
		'rgb(255, 217, 102)',
		'rgb(147, 196, 125)',
		'rgb(118, 165, 175)',
		'rgb(109, 158, 235)',
		'rgb(111, 168, 220)',
		'rgb(142, 124, 195)',
		'rgb(194, 123, 160)',
		'rgb(166, 28, 0)',
		'rgb(204, 0, 0)',
		'rgb(230, 145, 56)',
		'rgb(241, 194, 50)',
		'rgb(106, 168, 79)',
		'rgb(69, 129, 142)',
		'rgb(60, 120, 216)',
		'rgb(61, 133, 198)',
		'rgb(103, 78, 167)',
		'rgb(166, 77, 121)',
		'rgb(91, 15, 0)',
		'rgb(102, 0, 0)',
		'rgb(120, 63, 4)',
		'rgb(127, 96, 0)',
		'rgb(39, 78, 19)',
		'rgb(12, 52, 61)',
		'rgb(28, 69, 135)',
		'rgb(7, 55, 99)',
		'rgb(32, 18, 77)',
		'rgb(76, 17, 48)',
	],
};
