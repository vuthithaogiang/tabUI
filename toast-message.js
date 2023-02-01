function toast({
    title = '',
    message = '',
    type = 'infor',
    duration = 1000 }) {

    const main = document.getElementById('toast');

    if (main) {
        const toast = document.createElement('div');

        //remove toast auto 
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);

        }, duration + 1000);

        //remove toast when clicked on toast__close
        toast.addEventListener('click', function (e) {
            console.log(e.target);
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        });

        const icons = {
            success: 'fa-regular fa-circle-check',
            failure: 'fa-solid fa-circle-exclamation',
            infor: 'fa-solid fa-circle-info'


        };

        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);
        console.log(delay);


        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
           <div class="toast__icon">
            <i class="${icon}"></i>

           </div>
           <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">${message}</p>
           </div>
           <div class="toast__close">
            <i class="fa-solid fa-xmark"></i>
           </div>
         `;
        console.log(toast);

        main.appendChild(toast);

    }
}


function showSuccessToast() {
    toast({
        title: 'Success',
        message: 'Thành công! Xin cảm ơn.',
        type: 'success',
        duration: 3000

    });

}

function showFailureToast() {
    toast({
        title: 'Failure',
        message: 'Thất bại! Vui lòng thử lại sau.',
        type: 'failure',
        duration: 3000

    });
}

function showInformationToast() {
    toast({
        title: 'Information',
        message: 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên.',
        type: 'infor',
        duration: 3000

    });
}

