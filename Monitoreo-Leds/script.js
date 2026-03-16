document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");

  const loginContainer = document.getElementById("loginContainer");
  const mainContainer = document.getElementById("mainContainer");
  const logoutBtn = document.getElementById("logoutBtn");

  const humiditySlider = document.getElementById("humiditySlider");
  const humidityValue = document.getElementById("humidityValue");
  const humidityLed = document.getElementById("humidityLed");
  const humidityStatus = document.getElementById("humidityStatus");
  const humidityDetail = document.getElementById("humidityDetail");

  const tempSlider = document.getElementById("tempSlider");
  const tempValue = document.getElementById("tempValue");
  const tempLed = document.getElementById("tempLed");
  const tempStatus = document.getElementById("tempStatus");
  const tempDetail = document.getElementById("tempDetail");

  const generalState = document.getElementById("generalState");
  const criticalSensor = document.getElementById("criticalSensor");

  const correctUsername = "angel";
  const correctPassword = "12345";

  mainContainer.style.display = "none";

  function resetLedClasses(ledElement) {
    ledElement.classList.remove("red", "yellow", "green");
  }

  function updateGeneralStatus() {
    const humidity = parseInt(humiditySlider.value);
    const temperature = parseInt(tempSlider.value);

    let systemMessage = "Operación estable";
    let criticalMessage = "Ninguno";

    if (humidity <= 8) {
      systemMessage = "Alerta activa";
      criticalMessage = "Humedad";
    }

    if (temperature > 30) {
      systemMessage = "Alerta activa";
      criticalMessage =
        criticalMessage === "Humedad"
          ? "Humedad y temperatura"
          : "Temperatura";
    }

    if (systemMessage !== "Alerta activa") {
      if (
        (humidity > 8 && humidity <= 20) ||
        (temperature >= 15 && temperature <= 30)
      ) {
        systemMessage = "Advertencia";
        criticalMessage = "Supervisión recomendada";
      }
    }

    generalState.textContent = systemMessage;
    criticalSensor.textContent = criticalMessage;
  }

  function updateHumidity() {
    const value = parseInt(humiditySlider.value);
    humidityValue.textContent = value;

    resetLedClasses(humidityLed);

    if (value <= 8) {
      humidityLed.classList.add("red");
      humidityStatus.textContent = "Estado: Humedad baja";
      humidityDetail.textContent = "Condición crítica detectada.";
    } else if (value <= 20) {
      humidityLed.classList.add("yellow");
      humidityStatus.textContent = "Estado: Advertencia";
      humidityDetail.textContent = "La humedad está en rango intermedio.";
    } else {
      humidityLed.classList.add("green");
      humidityStatus.textContent = "Estado: Humedad adecuada";
      humidityDetail.textContent = "Condición estable.";
    }
  }

  function updateTemperature() {
    const value = parseInt(tempSlider.value);
    tempValue.textContent = value;

    resetLedClasses(tempLed);

    if (value < 15) {
      tempLed.classList.add("green");
      tempStatus.textContent = "Estado: Temperatura baja";
      tempDetail.textContent = "Temperatura dentro del rango seguro.";
    } else if (value <= 30) {
      tempLed.classList.add("yellow");
      tempStatus.textContent = "Estado: Temperatura media";
      tempDetail.textContent = "Zona preventiva.";
    } else {
      tempLed.classList.add("red");
      tempStatus.textContent = "Estado: Temperatura alta";
      tempDetail.textContent = "Condición crítica.";
    }
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (username === correctUsername && password === correctPassword) {
      errorMessage.textContent = "";
      loginContainer.style.display = "none";
      mainContainer.style.display = "flex";

      updateHumidity();
      updateTemperature();
      updateGeneralStatus();
    } else {
      errorMessage.textContent = "Usuario o contraseña incorrectos";
    }
  });

  logoutBtn.addEventListener("click", function () {
    mainContainer.style.display = "none";
    loginContainer.style.display = "flex";

    usernameInput.value = "";
    passwordInput.value = "";
    errorMessage.textContent = "";
  });

  humiditySlider.addEventListener("input", function () {
    updateHumidity();
    updateGeneralStatus();
  });

  tempSlider.addEventListener("input", function () {
    updateTemperature();
    updateGeneralStatus();
  });
});