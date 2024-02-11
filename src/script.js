const lazForm = document.querySelector('#lazForm');
const lazList = document.querySelector('#laz-list');
const lazRowTemp = document.querySelector('#laz-row-template');

lazForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  lazList.innerHTML = '';

  const lazNames = document
    .querySelector('#lazNames')
    .value.trim()
    .replace(/\s+/g, ' ')
    .split(/ /);

  lazNames.forEach((lazName) => {
    const element = lazRowTemp.content.cloneNode(true);

    element.querySelector('[data-id]').setAttribute('data-id', lazName);
    element.querySelector('[data-name]').textContent = lazName;
    const status = element.querySelector('[data-status]');
    status.textContent = 'Waiting...';
    status.classList.add('waiting');

    lazList.append(element);
  });

  const searchingFolderPath = document.querySelector('#searchingFolder').value;
  const copingFolderPath = document.querySelector('#copingFolder').value;

  lazNames.forEach(async (lazName) => {
    const res = await api.copyLaz({ lazName, searchingFolderPath, copingFolderPath });
    const element = document.querySelector(`[data-id=${lazName}`);

    if (res) {
      const status = element.querySelector('[data-status]');
      status.textContent = 'Waiting...';
      status.classList.remove('waiting');
      status.classList.add('success');
      status.textContent = 'Succeed';
    } else {
      const status = element.querySelector('[data-status]');
      status.textContent = 'Waiting...';
      status.classList.remove('waiting');
      status.classList.add('error');
      status.textContent = 'Error';
    }
  });
});
