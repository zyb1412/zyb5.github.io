class TreasureMap {
  static async getInitialClue() {
    return "在古老的图书馆里找到了第一个线索...";
  }

  static async decodeAncientScript() {
    const answer = prompt("在遥远的时代，有一座隐藏在密林深处的建筑，它见证了无数岁月的沧桑，承载着古老的文明与智慧。这里曾是人迹罕至的圣地，如今却成为了探险家们心中的向往。请问，这个地方是什么？");
    if (answer === "神庙") {
      return "解码成功!宝藏在一座古老的神庙中...";
    } else {
      alert("回答错误，请重新输入！");
      return await this.decodeAncientScript();
    }
  }

  static async encounterTempleGuardian() {
    return "小心! 神庙守卫在这里! 寻宝失败!";
  }

  static async searchTemple() {
    return "找到了一个神秘的箱子...";
  }

  static async openTreasureBox() {
    return "恭喜!你找到了传说中的宝藏!";
  }
}

let currentStep = 0;

function showStep(stepIndex, message) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => step.style.display = 'none');
  const stepElement = steps[stepIndex];
  stepElement.querySelector('p').textContent = message;
  stepElement.style.display = 'block';
}

function setupSteps() {
  document.getElementById('next-step').style.display = 'none';
  document.getElementById('restart').style.display = 'none';
  document.getElementById('start-treasure-hunt').addEventListener('click', startTreasureHunt);
  document.getElementById('next-step').addEventListener('click', nextStep);
  document.getElementById('restart').addEventListener('click', restart);
}

async function startTreasureHunt() {
  document.getElementById('start-treasure-hunt').style.display = 'none';
  await nextStep();
}

async function nextStep() {
  const steps = [
    { func: TreasureMap.getInitialClue, stepId: 'library-step' },
    { func: TreasureMap.decodeAncientScript, stepId: 'script-step' },
    { func: async () => {
        // 50%的概率遇到神庙守卫
        if (Math.random() > 0.6) {
          return { message: await TreasureMap.encounterTempleGuardian(), stepId: 'guard-step' };
        } else {
          return { message: await TreasureMap.searchTemple(), stepId: 'temple-step' };
        }
      }
    },
    { func: TreasureMap.openTreasureBox, stepId: 'treasure-step' }
  ];

  if (currentStep < steps.length) {
    const stepInfo = steps[currentStep];
    let message;
    let stepId = stepInfo.stepId;

    // 如果是第三步，需要根据返回结果确定步骤ID
    if (currentStep === 2) {
      const result = await stepInfo.func();
      message = result.message;
      stepId = result.stepId;
    } else {
      message = await stepInfo.func();
    }

    showStep(stepId, message);

    // 如果遇到神庙守卫，则显示失败信息并结束游戏
    if (message.includes("寻宝失败")) {
      document.getElementById('next-step').style.display = 'none';
      document.getElementById('restart').style.display = 'inline';
      return;
    }

    currentStep++;
    if (currentStep < steps.length) {
      document.getElementById('next-step').style.display = 'inline';
    } else {
      document.getElementById('next-step').style.display = 'none';
      document.getElementById('restart').style.display = 'inline';
    }
  }
}

function showStep(stepId, message) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => step.style.display = 'none');
  const stepElement = document.getElementById(stepId);
  stepElement.querySelector('p').textContent = message;
  stepElement.style.display = 'block';
}

function restart() {
  currentStep = 0;
  // 隐藏所有步骤
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => step.style.display = 'none');
  
  // 隐藏或显示按钮
  document.getElementById('next-step').style.display = 'none';
  document.getElementById('restart').style.display = 'none';
  document.getElementById('start-treasure-hunt').style.display = 'inline';
}

// 初始化页面
window.onload = setupSteps;
