const buttons = document.querySelectorAll('button[data-path]');
const responseStatus = document.querySelector('#response-status');
const responseBody = document.querySelector('#response-body');

let latestRequest = 0;

for (const button of buttons) {
  button.addEventListener('click', async () => {
    latestRequest += 1;
    const requestNumber = latestRequest;
    const path = button.dataset.path;
    const method = button.dataset.method || 'GET';

    responseStatus.textContent = `Sending ${method} ${path}…`;
    responseBody.textContent = '';

    try {
      const response = await fetch(path, { method });
      const contentType = response.headers.get('Content-Type') || '';
      const body = contentType.includes('application/json')
        ? JSON.stringify(await response.json(), null, 2)
        : await response.text();

      if (requestNumber === latestRequest) {
        responseStatus.textContent = `HTTP ${response.status} ${response.statusText}`;
        responseBody.textContent = body;
      }
    } catch {
      if (requestNumber === latestRequest) {
        responseStatus.textContent = 'Request failed.';
        responseBody.textContent = 'Check that the server is running and try again.';
      }
    }
  });
}
