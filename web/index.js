function pie(data, contentEl, config = {}) {
  if(!data || !contentEl) {
    throw new Error("One or more of the required fields for the pie chart is missing.")
    return;
  }

  const percentages = data.map(item => item.percent);
  const highestPercent = Math.max.apply(this, percentages);
  const index = percentages.indexOf(highestPercent);
  const bg = data[index].color;



  const styles = document.createElement("style")
  const createUUIDToken = () => {
    var result = '';
    const classLength = config.randomClassLength ?? 10;
    var characters = config.randomClassCharacters ?? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < classLength; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  };




  contentEl.classList.add("pie");
  const wrapperToken = createUUIDToken();
  contentEl.classList.add(wrapperToken);


  const els = []
  const percents = []
  const color = [];
  data.forEach((percentsItem, i) => {
    const el = document.createElement(config.pieItemType ?? "div");

    const token = createUUIDToken()

    el.classList.add(token)

    els.push(token)
    percents.push(percentsItem.percent)
    color.push(percentsItem.color)

    el.innerHTML = `
    <div><span>${percentsItem.text}</span></div>
  `

    contentEl.appendChild(el)
  })


  const size = config.chartSize ?? 400;
  function calculateRotation(percents) {
    return percents * 360 / 100;
  }
  const rotations = percents.map(item => calculateRotation(item))

  const styleLiteral = `
  .${wrapperToken}{
    width: ${size + "px"};
    height: ${size + "px"};
    border-radius:50%;
    overflow:hidden;
    position:relative;
    transform: rotate(${rotations[0] / 2 + "deg"});
    font-family: ${config.font};
    background:${bg};
  }

  ${percents.map((percentsItem, i) => {
      const angle = percentsItem * 360 / 100;

      let n = i - 1;

      const deff = (rotations[0] - rotations[i]) / 2;
      let ang = 0;


      while (n >= 0) {
        ang = ang + rotations[n];
        n = n - 1;
      }

      const cal = ang - deff

      ang = (angle) / 2 * (Math.PI / 180);
      const width = size * Math.tan(ang);
      const scale = width / size;

      return `
       .${wrapperToken} .${els[i]} {
        width:${size * 2 + "px"};
        height:${size * 2 + "px"};	
        position: absolute;
        top:-${size / 2 + "px"};	
        left:-${size / 2 + "px"};
        transform:rotate(${cal}deg);	
       }

        .${wrapperToken} .${els[i]} div {
          	width:${size * 2}px;
				    height:${size * 2}px;

        }

        .${wrapperToken} .${els[i]} div::after {
          content:'';
					width:0;
					height:0;
					display:block;
					border: solid transparent;
					border-width: ${size}px;
					border-top-color:${color[i]};
					position:relative;
	

					transform:scaleX(${scale});

        }

        .${wrapperToken} .${els[i]} div span{
					display:block;
					width:100%;
					position:absolute;
					left:0;
					top:34%;
					font-size:${data[i].textSize ?? config.textSize ?? 15}px;
					text-align:center;
					z-index:100;
					color:#fff;
					transform:rotate(${-cal - rotations[0] / 2}deg);
				}
    `
    }
    ).join("")}
`

  styles.innerHTML = styleLiteral;

  const styleAppend = config.styleLocation ?? "head"

  document.querySelector(styleAppend).appendChild(styles)


}

