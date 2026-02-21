const passwordInput = document.getElementById('YourPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const togglePassword = document.getElementById('togglePassword');
const requirements = document.querySelectorAll('.requirement');

const colors = {
  weak: '#ef4444',
  moderate: '#f59e0b',
  strong: '#10b981',
  default: '#1e293b'
};

const texts = {
  empty: 'Waiting for input...',
  weak: 'Weak - Time to improve',
  moderate: 'Moderate - Getting better',
  strong: 'Strong - Great work!',
  secure: 'Secure - Bulletproof!',
  compromised: 'Compromised - Common password!',
  sequential: 'Predictable - Sequential pattern!'
};

const commonPasswords = [
  "123456",
  "password",
  "admin",
  "qwerty",
  "12345678",
  "letmein",
  "12345",
  "123456789",
  "password123"
];

const hasSequentialPattern = (password) => {
  const lower = password.toLowerCase();
  for (let i = 0; i < lower.length - 3; i++) {
    const charCode1 = lower.charCodeAt(i);
    const charCode2 = lower.charCodeAt(i + 1);
    const charCode3 = lower.charCodeAt(i + 2);
    const charCode4 = lower.charCodeAt(i + 3);

    // Check for alphanumeric sequences (e.g., abcd, 1234)
    if (
      ((charCode1 >= 48 && charCode1 <= 57) || (charCode1 >= 97 && charCode1 <= 122)) &&
      charCode2 === charCode1 + 1 &&
      charCode3 === charCode2 + 1 &&
      charCode4 === charCode3 + 1
    ) {
      return true;
    }
  }
  return false;
};

const checkRequirements = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  let score = 0;

  requirements.forEach(req => {
    const type = req.getAttribute('data-requirement');
    const icon = req.querySelector('i');

    if (checks[type]) {
      req.classList.add('valid');
      icon.className = 'fas fa-check-circle';
      score++;
    } else {
      req.classList.remove('valid');
      icon.className = 'fas fa-circle-notch';
    }
  });

  return score;
};

const updateStrengthUI = (score, length, password) => {
  let width = '0%';
  let color = colors.weak;
  let text = texts.empty;

  const isCommon = commonPasswords.includes(password.toLowerCase());
  const isSequential = hasSequentialPattern(password);

  // Reduce score for sequential patterns
  const effectiveScore = isSequential ? Math.max(1, score - 2) : score;

  if (length > 0) {
    width = `${(effectiveScore / 5) * 100}%`;

    if (isCommon) {
      color = colors.weak;
      text = texts.compromised;
      width = '100%';
    } else if (isSequential) {
      color = colors.weak;
      text = texts.sequential;
    } else if (effectiveScore <= 2) {
      color = colors.weak;
      text = texts.weak;
    } else if (effectiveScore <= 4) {
      color = colors.moderate;
      text = texts.moderate;
    } else {
      color = colors.strong;
      text = texts.strong;
    }

    if (!isCommon && !isSequential && effectiveScore === 5 && length >= 12) {
      text = texts.secure;
    }
  }

  strengthBar.style.width = width;
  strengthBar.style.backgroundColor = color;
  strengthBar.style.boxShadow = `0 0 15px ${color}44`;
  strengthText.textContent = text;
  strengthText.style.color = length > 0 ? color : 'var(--text-secondary)';
};

passwordInput.addEventListener('input', (e) => {
  const password = e.target.value;
  const score = checkRequirements(password);
  updateStrengthUI(score, password.length, password);
});

togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

  const icon = togglePassword.querySelector('i');
  icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
});

const generatePassword = () => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";

  // Ensure at least one of each requirement
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*()"[Math.floor(Math.random() * 10)];

  for (let i = 0; i < 12; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  passwordInput.value = password;
  passwordInput.dispatchEvent(new Event('input'));
};

document.getElementById('generateBtn').addEventListener('click', generatePassword);
