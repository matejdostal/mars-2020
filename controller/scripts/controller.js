
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.controller-container').addEventListener('click', event => {
        const { target } = event;
        switch (target.id) {
            case "up":
                sendMessage("UP");
                break;
            case "down":
                sendMessage("DOWN");
                break;
            case "left":
                sendMessage("LEFT");
                break;
            case "right":
                sendMessage("RIGHT");
                break;
            case "head-left":
                sendMessage("HEAD_LEFT");
                break;
            case "head-right":
                sendMessage("HEAD_RIGHT");
                break;
            case "stop":
                sendMessage("STOP");
                break;
            case "reset":
                sendMessage("RESET");
                break;
        }
    });
    const refreshEl = document.querySelector('#refresh');
    refreshEl.addEventListener('click', () => {
        if (!refreshEl.classList.contains('rotate')) {
            refreshEl.classList.add('rotate');
            setTimeout(() => { //ANIMATION
                closeConnection();
                openConnection();
            }, 400);
        }
    });
});
