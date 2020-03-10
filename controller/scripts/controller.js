
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
            case "stop":
                sendMessage("STOP");
                break;
        }
    });
});
