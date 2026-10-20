document.addEventListener('DOMContentLoaded', () => {
 
    const SHOW_ADMIN_NAV = true;
    if (!SHOW_ADMIN_NAV) document.body.classList.add('nav-hidden');
 
    const openBtn = document.getElementById('adress-open');
    const popup = document.getElementById('adress-popup');
    const closeBtn = document.getElementById('adress-close');
    const confirmAddressBtn = document.getElementById('confirm-address-btn');
 
    if (openBtn && popup) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            popup.style.display = 'flex';
        });
    }
 
    if (closeBtn && popup) {
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }
 
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.style.display = 'none';
        });
    }
 
    if (confirmAddressBtn) {
        confirmAddressBtn.addEventListener('click', () => {
            const province = document.getElementById('province-select').value;
            if (province) {
                openBtn.innerHTML = `${province} <i class="fa-solid fa-square-caret-down"></i>`;
            }
            popup.style.display = 'none';
        });
    }
 
    const registerForm = document.getElementById('form-register-box');
    const loginForm = document.getElementById('form-login-box');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('input[placeholder="Họ và tên"]').value.trim();
            const phone = registerForm.querySelector('input[placeholder="Số điện thoại"]').value.trim();
            const pass = registerForm.querySelector('input[placeholder="Tạo mật khẩu"]').value.trim();

            if (!/^\d{9,11}$/.test(phone)) {
                alert('Số điện thoại phải gồm 9 đến 11 chữ số.');
                return;
            }
            if (pass.length < 6) {
                alert('Mật khẩu phải có ít nhất 6 ký tự.');
                return;
            }
            if (localStorage.getItem('user_phone') && !confirm('Trên trình duyệt này đã có tài khoản. Tạo tài khoản mới sẽ thay thế tài khoản cũ. Tiếp tục?')) {
                return;
            }

            localStorage.setItem('user_phone', phone);
            localStorage.setItem('user_pass', pass);
            localStorage.setItem('user_name', name);

            alert('Đăng ký tài khoản thành công! Hãy đăng nhập ngay.');
            registerForm.reset();
            toggleAuthForm('login');
        });
    }

    const forgotForm = document.getElementById('form-forgot-box');
    const forgotSendBtn = document.getElementById('forgot-send-btn');
    const forgotStep2 = document.getElementById('forgot-step2');
    const forgotPhone = document.getElementById('forgot-phone');
    const forgotCode = document.getElementById('forgot-code');
    const forgotNewPass = document.getElementById('forgot-newpass');
    const forgotResetBtn = document.getElementById('forgot-reset-btn');
    let pendingResetCode = null;

    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = forgotPhone.value.trim();
            const savedPhone = (localStorage.getItem('user_phone') || '').trim();

            if (!savedPhone) {
                alert('Chưa có tài khoản nào được đăng ký trên trình duyệt này.');
                return;
            }
            if (phone !== savedPhone) {
                alert('Số điện thoại này chưa được đăng ký.');
                return;
            }

            pendingResetCode = String(Math.floor(100000 + Math.random() * 900000));
            alert(`Mã xác nhận (bản demo): ${pendingResetCode}`);
            forgotStep2.style.display = 'flex';
            forgotSendBtn.style.display = 'none';
            forgotPhone.readOnly = true;
        });
    }

    if (forgotResetBtn) {
        forgotResetBtn.addEventListener('click', () => {
            const code = forgotCode.value.trim();
            const newPass = forgotNewPass.value.trim();

            if (!pendingResetCode || code !== pendingResetCode) {
                alert('Mã xác nhận không đúng.');
                return;
            }
            if (newPass.length < 6) {
                alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
                return;
            }

            localStorage.setItem('user_pass', newPass);
            pendingResetCode = null;
            alert('Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.');

            forgotForm.reset();
            forgotStep2.style.display = 'none';
            forgotSendBtn.style.display = '';
            forgotPhone.readOnly = false;
            toggleAuthForm('login');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputPhone = loginForm.querySelector('input[placeholder="Số điện thoại hoặc Email"]').value.trim();
            const inputPass = loginForm.querySelector('input[placeholder="Mật khẩu"]').value.trim();

            const savedPhone = (localStorage.getItem('user_phone') || '').trim();
            const savedPass = (localStorage.getItem('user_pass') || '').trim();
            const savedName = localStorage.getItem('user_name');

            const isAdmin = inputPhone === 'admin' && inputPass === '123456';
            const isUser = savedPhone !== '' && inputPhone === savedPhone && inputPass === savedPass;

            if (isAdmin || isUser) {
                alert(`Đăng nhập thành công! Xin chào ${savedName || 'Quản trị viên'}`);
                showPage('home');
                document.getElementById('login-link').innerHTML = `<i class="fa-regular fa-user"></i> ${savedName || 'Tài khoản'}`;
            } else if (savedPhone === '') {
                alert('Chưa có tài khoản nào được đăng ký trên trình duyệt này. Hãy bấm "Đăng ký ngay" trước.');
            } else if (inputPhone !== savedPhone) {
                alert('Số điện thoại không khớp với tài khoản đã đăng ký.');
            } else {
                alert('Mật khẩu không đúng.');
            }
        });
    }
 
    const track = document.querySelector('.slider-content-left-top');
    const slider = document.querySelector('.slider-content-left-container');
    const leftBtn = document.getElementById('btn-left');
    const rightBtn = document.getElementById('btn-right');
    const tabs = Array.from(document.querySelectorAll('.slider-content-left-bottom li'));
    const INTERVAL = 3000;
 
    if (track && slider) {
        const slideCount = track.querySelectorAll('a').length;
        let index = 0;
        let timer = null;
 
        function goTo(i) {
            index = (i + slideCount) % slideCount;
            track.style.transform = `translateX(-${index * 100}%)`;
            tabs.forEach((tab, k) => tab.classList.toggle('active', k === index));
        }
 
        function stopAutoplay() { clearInterval(timer); }
        function startAutoplay() {
            stopAutoplay();
            timer = setInterval(() => goTo(index + 1), INTERVAL);
        }
 
        if (rightBtn) rightBtn.addEventListener('click', () => { goTo(index + 1); startAutoplay(); });
        if (leftBtn) leftBtn.addEventListener('click', () => { goTo(index - 1); startAutoplay(); });
 
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => { goTo(i); startAutoplay(); });
        });
 
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
 
        goTo(0);
        startAutoplay();
    }
 
    function getImgPath(imgSrc) {
        if (!imgSrc) return './anh/sp/1.png';
        const str = String(imgSrc);
        if (str.includes('/')) {
            return `./anh/sp/${str}`;
        }
        if (str.includes('.')) {
            return `./anh/sp/${str}`;
        }
        return `./anh/sp/${str}.png`;
    }
 
    const products = [
        {
            n: "iPhone 17 Pro Max 256GB Chính Hãng - Bảo hành 2 năm",
            img: "dienthoai/ip17promax.jpg",
            p: "34,490,000 đ",
            o: "37,490,000 đ",
            e: "34,390,000 đ",
            l: "34,340,000 đ",
            t: "Thanh toán qua Apps ngân hàng giá chỉ còn 32.860.000đ",
            m: 9
        },
        {
            n: "Samsung Galaxy S26 Ultra (5G) 12GB 256GB - 1 đổi 1 12 tháng",
            img: "dienthoai/ss.jpg",
            p: "29,990,000 đ",
            o: "36,990,000 đ",
            e: "29,790,000 đ",
            l: "29,790,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "Samsung Galaxy S25 Ultra (5G) 12GB 256GB - 1 đổi 1 12 tháng",
            img: "dienthoai/1.jpg",
            p: "24,990,000 đ",
            o: "33,380,000 đ",
            e: "24,790,000 đ",
            l: "24,790,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "iPhone 18 Pro 256GB",
            img: "dienthoai/18.png",
            p: "37,990,000 đ",
            o: "38,999,000 đ",
            e: "37,890,000 đ",
            l: "37,840,000 đ",
            t: "Giảm ngay 1.250.000đ khi toán qua VNPAY giá chỉ còn 36.750.000đ",
            m: 4
        },
        {
            n: "Samsung Galaxy A17 (5G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/6.jpg",
            p: "5,990,000 đ",
            o: "6,990,000 đ",
            e: "5,790,000 đ",
            l: "5,942,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 5
        },
        {
            n: "Samsung Galaxy Z Flip8 5G 12GB 256GB - 1 đổi 1 12 tháng",
            img: "dienthoai/f8.jpg",
            p: "27,990,000 đ",
            o: "35,990,000 đ",
            e: "27,790,000 đ",
            l: "27,710,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 7
        },
        {
            n: "Oppo A6 8GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/3.jpg",
            p: "10,990,000 đ",
            o: "11,990,000 đ",
            e: "10,790,000 đ",
            l: "10,902,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Oppo A6c 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/4.png",
            p: "4,290,000 đ",
            o: "4,990,000 đ",
            e: "4,090,000 đ",
            l: "4,256,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "iPhone 15 128GB VN/A - Bảo hành 2 năm",
            img: "dienthoai/5.jpg",
            p: "20,990,000 đ",
            o: "23,990,000 đ",
            e: "20,890,000 đ",
            l: "20,840,000 đ",
            t: "Tặng gói bảo hành 2 năm trị giá 2.000.000đ",
            m: 8
        },
        {
            n: "iPhone 18 Pro Max 512GB",
            img: "dienthoai/18.png",
            p: "47,490,000 đ",
            o: "48,499,000 đ",
            e: "47,390,000 đ",
            l: "47,340,000 đ",
            t: "Giảm ngay 2.500.000đ khi toán qua VNPAY giá chỉ còn 44.990.000đ",
            m: 4
        },
        {
            n: "iPhone 18 Pro Max 1TB",
            img: "dienthoai/18.png",
            p: "59,990,000 đ",
            o: "61,499,000 đ",
            e: "59,890,000 đ",
            l: "59,840,000 đ",
            t: "Giảm ngay 3.860.000đ khi toán qua VNPAY giá chỉ còn 58.130.000đ",
            m: 4
        },
        {
            n: "iPhone 18 Pro 512GB",
            img: "dienthoai/18.png",
            p: "44,490,000 đ",
            o: "45,499,000 đ",
            e: "44,390,000 đ",
            l: "44,340,000 đ",
            t: "Giảm ngay 1.550.000đ khi toán qua VNPAY giá chỉ còn 42.930.000đ",
            m: 4
        },
        {
            n: "iPhone 18 Pro Max 2TB",
            img: "dienthoai/18.png",
            p: "80,490,000 đ",
            o: "80,999,000 đ",
            e: "80,390,000 đ",
            l: "80,340,000 đ",
            t: "Tặng gói bảo hành 2 năm trị giá 2.000.000đ",
            m: 4
        },
        {
            n: "iPhone Duo 512GB | Bảo hành 2 năm",
            img: "dienthoai/duo.jpg",
            p: "70,990,000 đ",
            o: "71,499,000 đ",
            e: "70,890,000 đ",
            l: "70,840,000 đ",
            t: "Đang Update",
            m: 1
        },
        {
            n: "Samsung Galaxy A08 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/6.jpg",
            p: "4,490,000 đ",
            o: "",
            e: "4,290,000 đ",
            l: "4,454,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 5
        },
        {
            n: "Samsung Galaxy A07s 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/7.jpg",
            p: "4,290,000 đ",
            o: "4,590,000 đ",
            e: "4,090,000 đ",
            l: "4,256,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 5
        },
        {
            n: "Samsung Galaxy A57 (5G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/8.jpg",
            p: "10,390,000 đ",
            o: "12,490,000 đ",
            e: "10,190,000 đ",
            l: "10,307,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "Samsung Galaxy A37 (5G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/9.jpg",
            p: "9,250,000 đ",
            o: "10,790,000 đ",
            e: "9,050,000 đ",
            l: "9,176,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "Samsung Galaxy A56 (5G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/10.jpg",
            p: "8,990,000 đ",
            o: "9,810,000 đ",
            e: "8,790,000 đ",
            l: "8,918,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "Samsung Galaxy S26 (5G) 12GB 256GB - 1 đổi 1 12 tháng",
            img: "dienthoai/11.jpg",
            p: "20,990,000 đ",
            o: "25,990,000 đ",
            e: "20,790,000 đ",
            l: "20,822,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "iPhone 17e 256GB Chính Hãng - Bảo hành 2 năm",
            img: "dienthoai/12.jpg",
            p: "17,250,000 đ",
            o: "",
            e: "17,150,000 đ",
            l: "17,112,000 đ",
            t: "Thanh toán qua Apps ngân hàng giá chỉ còn 16.425.000đ",
            m: 9
        },
        {
            n: "iPhone 17 256GB Chính Hãng - Bảo hành 2 năm",
            img: "dienthoai/13.jpg",
            p: "27,490,000 đ",
            o: "",
            e: "27,390,000 đ",
            l: "27,340,000 đ",
            t: "Thanh toán qua Apps ngân hàng giá chỉ còn 22.410.000đ",
            m: 9
        },
        {
            n: "Oppo Reno15 F (5G) 8GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/14.jpg",
            p: "10,790,000 đ",
            o: "11,990,000 đ",
            e: "10,590,000 đ",
            l: "10,704,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 4
        },
        {
            n: "Oppo Reno15 (5G) 12GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/15.jpg",
            p: "14,690,000 đ",
            o: "16,990,000 đ",
            e: "14,490,000 đ",
            l: "14,572,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 4
        },
        {
            n: "Oppo Reno16 F (5G) 8GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/16.jpg",
            p: "14,690,000 đ",
            o: "15,990,000 đ",
            e: "14,490,000 đ",
            l: "14,572,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Samsung Galaxy S25 FE (5G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/17.jpg",
            p: "13,290,000 đ",
            o: "16,690,000 đ",
            e: "13,090,000 đ",
            l: "13,184,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "Oppo Find X9 (5G) 16GB 512GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/19.jpg",
            p: "23,990,000 đ",
            o: "26,990,000 đ",
            e: "23,790,000 đ",
            l: "23,840,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Oppo Find X9s 12GB 256GB - 1 Đổi 1 12 Tháng",
            img:"dienthoai/20.jpg",
            p: "20,490,000 đ",
            o: "24,990,000 đ",
            e: "20,290,000 đ",
            l: "20,340,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Xiaomi Redmi Note 15 (5G) 6GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/21.jpg",
            p: "6,190,000 đ",
            o: "7,490,000 đ",
            e: "5,990,000 đ",
            l: "6,140,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Xiaomi Redmi Note 15 (4G) 6GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/22.jpg",
            p: "5,190,000 đ",
            o: "5,990,000 đ",
            e: "4,990,000 đ",
            l: "5,148,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 2
        },
        {
            n: "iPhone Duo 256GB | Bảo hành 2 năm",
            img: "dienthoai/duo.jpg",
            p: "64,490,000 đ",
            o: "",
            e: "64,390,000 đ",
            l: "64,340,000 đ",
            t: "Đang Update",
            m: 1
        },
        {
            n: "iPhone 17 Pro 256GB Chính Hãng - Bảo hành 2 năm",
            img: "dienthoai/ip17promax.jpg",
            p: "31,190,000 đ",
            o: "34,390,000 đ",
            e: "31,090,000 đ",
            l: "31,040,000 đ",
            t: "Thanh toán qua Apps ngân hàng giá chỉ còn từ 29.280.000đ",
            m: 9
        },
        {
            n: "Samsung Galaxy A18 6GB 128GB",
            img: "dienthoai/24.jpg",
            p: "6,850,000 đ",
            o: "",
            e: "6,650,000 đ",
            l: "6,795,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 5
        },
        {
            n: "Samsung Galaxy S26 FE 8GB 128GB",
            img: "dienthoai/25.jpg",
            p: "16,190,000 đ",
            o: "",
            e: "15,990,000 đ",
            l: "16,060,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 8
        },
        {
            n: "Samsung Galaxy S26 Plus (5G) 12GB 256GB - 1 đổi 1 12 tháng",
            img: "dienthoai/26.jpg",
            p: "23,890,000 đ",
            o: "29,990,000 đ",
            e: "23,690,000 đ",
            l: "23,699,000 đ",
            t: "Tặng củ sạc samsung 25W chính hãng trị giá 490.000đ",
            m: 6
        },
        {
            n: "Xiaomi Redmi Note 15 (4G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/27.jpg",
            p: "5,790,000 đ",
            o: "6,490,000 đ",
            e: "5,590,000 đ",
            l: "5,744,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 2
        },
        {
            n: "Xiaomi 17T Pro (5G) 12GB 512GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/28.jpg",
            p: "20,490,000 đ",
            o: "24,990,000 đ",
            e: "20,290,000 đ",
            l: "20,326,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 2
        },
        {
            n: "Samsung Galaxy Z Fold8 Ultra 5G 12GB 512GB - 1 đổi 1 12 tháng",
            img: "dienthoai/39.jpg",
            p: "52,990,000 đ",
            o: "60,990,000 đ",
            e: "52,790,000 đ",
            l: "52,490,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 7
        },
        {
            n: "Samsung Galaxy Z Fold8 Ultra 5G 16GB 1TB - 1 đổi 1 12 tháng",
            img: "dienthoai/30.jpg",
            p: "63,990,000 đ",
            o: "69,990,000 đ",
            e: "63,790,000 đ",
            l: "63,490,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 7
        },
        {
            n: "Xiaomi Redmi Note 15 Pro (4G) 12GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/31.jpg",
            p: "8,290,000 đ",
            o: "8,990,000 đ",
            e: "8,090,000 đ",
            l: "8,224,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 2
        },
        {
            n: "Xiaomi 17T (5G) 12GB 512GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/32.jpg",
            p: "16,990,000 đ",
            o: "20,990,000 đ",
            e: "16,790,000 đ",
            l: "16,854,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày trị giá 2.000.000đ",
            m: 2
        },
        {
            n: "Samsung Galaxy Z Fold8 5G 12GB 512GB - 1 đổi 1 12 tháng",
            img: "dienthoai/33.jpg",
            p: "47,990,000 đ",
            o: "55,990,000 đ",
            e: "47,790,000 đ",
            l: "47,510,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 7
        },
        {
            n: "Samsung Galaxy Z Fold8 5G 16GB 1TB - 1 đổi 1 12 tháng",
            img: "dienthoai/33.jpg",
            p: "57,990,000 đ",
            o: "63,990,000 đ",
            e: "57,790,000 đ",
            l: "57,490,000 đ",
            t: "Đặc quyền mua sắm: Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 7
        },
        {
            n: "Xiaomi 15T Pro (5G) 12GB 512GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/36.jpg",
            p: "16,990,000 đ",
            o: "19,490,000 đ",
            e: "—",
            l: "—",
            t: "—",
            m: 0
        },
        {
            n: "Oppo A3 (4G) - 1 Đổi 1 12 Tháng",
            img: "dienthoai/37.jpg",
            p: "4,690,000 đ",
            o: "5,990,000 đ",
            e: "—",
            l: "—",
            t: "—",
            m: 0
        },
        {
            n: "Xiaomi Redmi Note 17 (4G) 4GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/38.jpg",
            p: "5,990,000 đ",
            o: "6,990,000 đ",
            e: "—",
            l: "—",
            t: "—",
            m: 0
        },
        {
            n: "Samsung Galaxy Z Fold7 5G 12GB 256GB - 1 đổi 1 12 tháng",
            img: "dienthoai/50.jpg",
            p: "39,590,000 đ",
            o: "46,990,000 đ",
            e: "—",
            l: "—",
            t: "—",
            m: 0
        },
        {
            n: "Nokia 220 4G (2024) Chính Hãng",
            img: "dienthoai/51.jpg",
            p: "979,000 đ",
            o: "1,100,000 đ",
            e: "930,000 đ",
            l: "949,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 899.000 đ",
            m: 2
        },
        {
            n: "Nokia HMD 105 4G Chính Hãng",
            img: "dienthoai/52.jpg",
            p: "679,000 đ",
            o: "750,000 đ",
            e: "645,000 đ",
            l: "649,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 599.000đ",
            m: 2
        },
        {
            n: "Nokia 110 4G Pro (2023) Chính Hãng",
            img: "dienthoai/53.png",
            p: "739,000 đ",
            o: "850,000 đ",
            e: "702,000 đ",
            l: "709,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 699.000đ",
            m: 2
        },
        {
            n: "Nokia 3210 4G Chính Hãng",
            img: "dienthoai/54.jpg",
            p: "1,490,000 đ",
            o: "1,690,000 đ",
            e: "1,416,000 đ",
            l: "1,460,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 1.499.000 đ",
            m: 2
        },
        {
            n: "Nokia C32 4GB 128GB Chính Hãng",
            img: "dienthoai/55.png",
            p: "1,790,000 đ",
            o: "3,290,000 đ",
            e: "1,700,000 đ",
            l: "1,760,000 đ",
            t: "Freeship toàn quốc",
            m: 1
        },
        {
            n: "Điện thoại di động Itel IT8010 4G Chính Hãng",
            img: "dienthoai/56.png",
            p: "379,000 đ",
            o: "490,000 đ",
            e: "360,000 đ",
            l: "349,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 299.000đ",
            m: 2
        },
        {
            n: "Điện thoại di động Itel it2600 4G Chính Hãng",
            img: "dienthoai/57.png",
            p: "479,000 đ",
            o: "550,000 đ",
            e: "455,000 đ",
            l: "449,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 449.000đ",
            m: 2
        },
        {
            n: "Điện thoại di động Itel it9310 4G Chính Hãng",
            img: "dienthoai/58.jpg",
            p: "639,000 đ",
            o: "",
            e: "607,000 đ",
            l: "609,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 599.000đ",
            m: 2
        },
        {
            n: "Điện thoại di động Itel IT9211 4G Chính Hãng",
            img: "dienthoai/59.jpg",
            p: "479,000 đ",
            o: "690,000 đ",
            e: "455,000 đ",
            l: "449,000 đ",
            t: "Mua kèm sản phẩm bất kỳ giá chỉ còn 449.000đ",
            m: 2
        },
        {
            n: "Honor 600S (5G) 6GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/60.jpg",
            p: "9,490,000 đ",
            o: "10,490,000 đ",
            e: "9,290,000 đ",
            l: "9,390,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 1
        },
        {
            n: "Honor X9d 8GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/61.jpg",
            p: "9,990,000 đ",
            o: "11,990,000 đ",
            e: "9,790,000 đ",
            l: "9,890,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 1
        },
        {
            n: "Honor 600 (5G) 12GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/62.jpg",
            p: "16,990,000 đ",
            o: "",
            e: "16,790,000 đ",
            l: "16,890,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 1
        },
        {
            n: "Honor 600 (5G) 8GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/63.jpg",
            p: "15,990,000 đ",
            o: "17,990,000 đ",
            e: "15,790,000 đ",
            l: "15,890,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 1
        },
        {
            n: "Honor X8d 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/64.jpg",
            p: "6,990,000 đ",
            o: "8,090,000 đ",
            e: "6,790,000 đ",
            l: "6,890,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 1
        },
        {
            n: "Honor X7d 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/65.jpg",
            p: "4,790,000 đ",
            o: "5,790,000 đ",
            e: "4,590,000 đ",
            l: "4,690,000 đ",
            t: "—",
            m: 0
        },
        {
            n: "HONOR X6b 6GB 128GB Chính Hãng",
            img: "dienthoai/66.jpg",
            p: "2,690,000 đ",
            o: "3,990,000 đ",
            e: "2,556,000 đ",
            l: "2,590,000 đ",
            t: "—",
            m: 0
        },
        {
            n: "Honor X5b 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/67.jpg",
            p: "1,990,000 đ",
            o: "2,190,000 đ",
            e: "1,890,000 đ",
            l: "1,890,000 đ",
            t: "—",
            m: 0
        },
        {
            n: "HONOR Play10 (3GB/64GB) - 1 Đổi 1 12 Tháng",
            img: "dienthoai/68.jpg",
            p: "1,990,000 đ",
            o: "2,990,000 đ",
            e: "1,890,000 đ",
            l: "1,890,000 đ",
            t: "—",
            m: 0
        },
        {
            n: "Honor Magic V5 (5G) 16GB 512GB - Chính hãng 1 Đổi 1 12 Tháng",
            img: "dienthoai/69.jpg",
            p: "38,990,000 đ",
            o: "44,990,000 đ",
            e: "38,790,000 đ",
            l: "38,890,000 đ",
            t: "—",
            m: 0
        },
        {
            n: "Realme C85 (4G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/70.jpg",
            p: "4,790,000 đ",
            o: "6,290,000 đ",
            e: "4,590,000 đ",
            l: "4,752,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "Realme C85 (5G) 8GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/71.jpg",
            p: "7,590,000 đ",
            o: "8,090,000 đ",
            e: "7,390,000 đ",
            l: "7,529,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "Realme C85 Pro (4G) - 1 Đổi 1 12 Tháng",
            img: "dienthoai/72.jpg",
            p: "5,790,000 đ",
            o: "7,090,000 đ",
            e: "5,590,000 đ",
            l: "5,744,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "realme C100i 4GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/73.jpg",
            p: "4,890,000 đ",
            o: "5,290,000 đ",
            e: "4,690,000 đ",
            l: "4,851,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Realme Note 80 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/74.jpg",
            p: "3,490,000 đ",
            o: "3,990,000 đ",
            e: "3,316,000 đ",
            l: "3,462,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Realme Note 60 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/75.jpg",
            p: "2,590,000 đ",
            o: "3,990,000 đ",
            e: "2,460,000 đ",
            l: "2,569,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "Realme Note 60X 3GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/76.jpg",
            p: "2,290,000 đ",
            o: "2,990,000 đ",
            e: "2,176,000 đ",
            l: "2,272,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "Realme 14 (5G) 8GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/77.jpg",
            p: "8,590,000 đ",
            o: "9,490,000 đ",
            e: "8,390,000 đ",
            l: "8,521,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "Realme C75X 6GB 128GB - 1 đổi 1 12 tháng",
            img: "dienthoai/78.jpg",
            p: "3,990,000 đ",
            o: "4,690,000 đ",
            e: "3,790,000 đ",
            l: "3,958,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "Realme 12 (4G) 8GB 256GB - 1 Đổi 12 Tháng",
            img: "dienthoai/79.jpg",
            p: "4,490,000 đ",
            o: "7,990,000 đ",
            e: "4,290,000 đ",
            l: "4,454,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 12 tháng",
            m: 2
        },
        {
            n: "Vivo Y05e 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/80.jpg",
            p: "4,090,000 đ",
            o: "4,990,000 đ",
            e: "3,890,000 đ",
            l: "4,057,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Vivo Y05 (4G) 4GB 64GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/81.jpg",
            p: "4,290,000 đ",
            o: "4,990,000 đ",
            e: "4,090,000 đ",
            l: "4,256,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Vivo Y11d (4G) 4GB 128GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/82.jpg",
            p: "4,890,000 đ",
            o: "6,790,000 đ",
            e: "4,690,000 đ",
            l: "4,851,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Vivo Y11d (4G) 6GB 128GB - 1 Đổi 1 12 Tháng",
            img:"dienthoai/83.jpg",
            p: "5,290,000 đ",
            o: "7,290,000 đ",
            e: "5,090,000 đ",
            l: "5,248,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        },
        {
            n: "Vivo V70 FE 12GB 256GB - 1 Đổi 1 12 Tháng",
            img: "dienthoai/84.jpg",
            p: "13,990,000 đ",
            o: "15,990,000 đ",
            e: "13,790,000 đ",
            l: "13,878,000 đ",
            t: "Tặng gói bảo hành 1 đổi 1 365 ngày",
            m: 2
        }
    ];
 
    const toNumber = (text) => Number(String(text).replace(/\D/g, ''));
 
    const brandOf = (name) => {
        const n = name.toLowerCase();
        if (n.includes('iphone')) return 'iphone';
        if (n.includes('samsung')) return 'samsung';
        if (n.includes('xiaomi')) return 'xiaomi';
        if (n.includes('oppo')) return 'oppo';
        if (n.includes('nokia')) return 'nokia';
        if (n.includes('itel')) return 'itel';
        if (n.includes('honor')) return 'honor';
        if (n.includes('realme')) return 'realme';
        if (n.includes('vivo')) return 'vivo';
        return 'khac';
    };
 
    const PAGE_SIZE = 10;
    const grid = document.querySelector('.product-grid');
    const moreBtn = document.getElementById('more-btn');
    const lessBtn = document.getElementById('less-btn');
    const brandChips = Array.from(document.querySelectorAll('[data-brand]'));
    const productSection = document.querySelector('.product-section');
 
    let currentBrand = 'all';
    let currentPrice = 'all';
    let currentStorage = 'all';
    let currentRam = 'all';
    let currentSort = 'desc';
    let shown = PAGE_SIZE;
 
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = btn.parentElement;
            const menu = parent.querySelector('.dropdown-menu');
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.remove('show');
            });
            if (menu) menu.classList.toggle('show');
        });
    });
 
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    });
 
    window.setPriceFilter = function(val) { currentPrice = val; shown = PAGE_SIZE; draw(); };
    window.setStorageFilter = function(val) { currentStorage = val; shown = PAGE_SIZE; draw(); };
    window.setRamFilter = function(val) { currentRam = val; shown = PAGE_SIZE; draw(); };
 
    const resetBtn = document.getElementById('btn-reset-filter');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentBrand = 'all';
            currentPrice = 'all';
            currentStorage = 'all';
            currentRam = 'all';
            currentSort = 'desc';
            shown = PAGE_SIZE;
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            const defaultSort = document.querySelector('.sort-btn[data-sort="desc"]');
            if (defaultSort) defaultSort.classList.add('active');
            draw();
        });
    }
 
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.dataset.sort;
            draw();
        });
    });
 
    function getList() {
        return products.filter(p => {
            if (currentBrand !== 'all' && brandOf(p.n) !== currentBrand) return false;
 
            const priceNum = toNumber(p.p);
            if (currentPrice === 'under-5m' && priceNum >= 5000000) return false;
            if (currentPrice === '5m-15m' && (priceNum < 5000000 || priceNum > 15000000)) return false;
            if (currentPrice === '15m-30m' && (priceNum < 15000000 || priceNum > 30000000)) return false;
            if (currentPrice === 'above-30m' && priceNum <= 30000000) return false;
 
            if (currentStorage !== 'all' && !p.n.toUpperCase().includes(currentStorage.toUpperCase())) return false;
            if (currentRam !== 'all' && !p.n.toUpperCase().includes(currentRam.toUpperCase())) return false;
 
            return true;
        }).sort((a, b) => {
            if (currentSort === 'asc') return toNumber(a.p) - toNumber(b.p);
            return toNumber(b.p) - toNumber(a.p);
        });
    }
 
    function draw() {
        if (!grid) return;
 
        const list = getList();
        const visible = list.slice(0, shown);
 
        grid.innerHTML = visible.length
            ? visible.map((p) => `
                <div class="product-card" onclick="showProductDetail('${p.n.replace(/'/g, "\\'")}')" style="cursor: pointer;">
                    <span class="badge">Trả góp 0% trả trước 0đ</span>
                    <div class="product-img"><img src="${getImgPath(p.img)}" alt="${p.n}"></div>
                    <h4>${p.n}</h4>
                    <div class="price-row"><b class="price">${p.p}</b>${p.o ? `<s>${p.o}</s>` : ''}</div>
                    <div class="deal"><span>Ưu đãi Edu</span><b>${p.e}</b></div>
                    <div class="deal"><span>Khách hàng thân thiết</span><b>${p.l}</b></div>
                    <div class="note">${p.t}</div>
                    <div class="more" onclick="event.stopPropagation();">+ ${p.m} Khuyến mãi khác</div>
                </div>
            `).join('')
            : '<p class="empty">Không có sản phẩm phù hợp với bộ lọc đã chọn.</p>';
 
        if (moreBtn) moreBtn.style.display = list.length > shown ? 'inline-flex' : 'none';
        if (lessBtn) lessBtn.style.display = shown > PAGE_SIZE ? 'inline-flex' : 'none';
 
        brandChips.forEach((chip) => {
            chip.classList.toggle('active', chip.dataset.brand === currentBrand);
        });
    }
 
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            shown += PAGE_SIZE;
            draw();
        });
    }
 
    if (lessBtn) {
        lessBtn.addEventListener('click', () => {
            shown = PAGE_SIZE;
            draw();
            if (productSection) {
                productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
 
    brandChips.forEach((chip) => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const target = chip.dataset.brand;
            currentBrand = (target === 'all' || currentBrand === target) ? 'all' : target;
            shown = PAGE_SIZE;
            draw();
        });
    });
 
    draw();
 
    window.showPage = function(pageId) {
        document.querySelectorAll('.spa-page').forEach(page => {
            page.style.display = 'none';
        });
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
 
    window.showProductDetail = function(productName) {
        const product = products.find(p => p.n === productName);
        if (!product) return;
 
        let detailContainer = document.getElementById('product-detail-container');
        if (!detailContainer) {
            const detailPage = document.createElement('div');
            detailPage.id = 'page-detail';
            detailPage.className = 'spa-page container';
            detailPage.style.cssText = 'display: none; padding: 40px 0;';
            detailPage.innerHTML = `
                <button onclick="showPage('home')" style="margin-bottom: 20px; padding: 8px 16px; background: #eee; border: none; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-arrow-left"></i> Quay lại trang chủ</button>
                <div id="product-detail-container" style="display: flex; gap: 40px; background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #ddd; flex-wrap: wrap;"></div>
            `;
            document.body.appendChild(detailPage);
            detailContainer = document.getElementById('product-detail-container');
        }
 
        detailContainer.innerHTML = `
            <div style="flex: 1; min-width: 300px; text-align: center;">
                <img src="${getImgPath(product.img)}" alt="${product.n}" style="max-width: 100%; max-height: 400px; object-fit: contain;">
            </div>
            <div style="flex: 1.5; min-width: 300px; display: flex; flex-direction: column; gap: 15px;">
                <h2 style="font-size: 22px; color: #111; line-height: 1.4;">${product.n}</h2>
                <div style="display: flex; align-items: baseline; gap: 12px;">
                    <span style="color: #d70018; font-size: 24px; font-weight: bold;">${product.p}</span>
                    ${product.o ? `<s style="color: #888; font-size: 16px;">${product.o}</s>` : ''}
                </div>
 
                <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; border: 1px solid #eee; font-size: 14px; line-height: 1.6;">
                    <b>🎁 Ưu đãi & Khuyến mãi:</b><br>
                    - Ưu đãi Edu: <span style="color: #d70018; font-weight: bold;">${product.e}</span><br>
                    - Khách hàng thân thiết: <span style="color: #d70018; font-weight: bold;">${product.l}</span><br>
                    - Ghi chú: ${product.t}
                </div>
 
                <div>
                    <h4 style="font-size: 15px; margin-bottom: 8px; color: #333;">📋 Cấu hình kỹ thuật:</h4>
                    <ul style="padding-left: 20px; font-size: 14px; color: #444; line-height: 1.6;">
                        <li><b>Màn hình:</b> AMOLED/OLED độ phân giải cao, tần số quét 120Hz mượt mà.</li>
                        <li><b>Camera sau:</b> Cảm biến chính độ phân giải cao, hỗ trợ chụp đêm và quay video 4K.</li>
                        <li><b>Camera trước:</b> Tích hợp AI làm đẹp và gọi điện sắc nét.</li>
                        <li><b>Hiệu suất & Pin:</b> Vi xử lý tối ưu tiết kiệm pin, hỗ trợ sạc nhanh công suất lớn.</li>
                    </ul>
                </div>
 
                <div style="display: flex; gap: 15px; margin-top: 10px;">
                    <button onclick="addCurrentProductToCart('${product.n.replace(/'/g, "\\'")}')" style="flex: 1; height: 45px; background: #d70018; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px;">Thêm vào giỏ hàng</button>
                    <button onclick="showPage('home')" style="padding: 0 20px; height: 45px; background: #333; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Xem máy khác</button>
                </div>
            </div>
        `;
 
        showPage('detail');
    };
 
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
 
    function executeSearch() {
        if (!searchInput) return;
        const keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) return;
 
        showPage('search');
        document.getElementById('search-keyword-text').textContent = keyword;
 
        const matched = products.filter(p => p.n.toLowerCase().includes(keyword));
        const resGrid = document.getElementById('search-results-grid');
 
        resGrid.innerHTML = matched.length ? matched.map((p) => `
            <div class="product-card" onclick="showProductDetail('${p.n.replace(/'/g, "\\'")}')" style="cursor: pointer;">
                <span class="badge">Trả góp 0%</span>
                <div class="product-img"><img src="${getImgPath(p.img)}" alt="${p.n}"></div>
                <h4>${p.n}</h4>
                <div class="price-row"><b class="price">${p.p}</b>${p.o ? `<s>${p.o}</s>` : ''}</div>
            </div>
        `).join('') : '<p style="grid-column: 1/-1; text-align: center; padding: 30px 0;">Không tìm thấy sản phẩm phù hợp.</p>';
    }
 
    if (searchBtn) searchBtn.addEventListener('click', executeSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }
 
    let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
    let orderHistory = JSON.parse(localStorage.getItem('user_orders')) || [];
 
    function saveCart() {
        localStorage.setItem('user_cart', JSON.stringify(cart));
    }
 
    window.addCurrentProductToCart = function(productName) {
        const product = products.find(p => p.n === productName);
        if (!product) return;
 
        const existingItem = cart.find(item => item.name === product.n);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: product.n,
                price: product.p,
                img: getImgPath(product.img),
                quantity: 1
            });
        }
        saveCart();
        alert(`Đã thêm sản phẩm "${product.n}" vào giỏ hàng!`);
    };
 
    function renderCartPage() {
        const cartContainer = document.getElementById('cart-content-container');
        if (!cartContainer) return;
 
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <p style="color: #555;">Hiện tại giỏ hàng của bạn đang trống.</p>
                <button onclick="showPage('home')" style="margin-top: 20px; padding: 10px 20px; background: #d70018; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Tiếp tục mua sắm</button>
            `;
            return;
        }
 
        let totalPrice = 0;
        let html = `<div style="display: flex; flex-direction: column; gap: 15px;">`;
 
        cart.forEach((item, index) => {
            const numericPrice = Number(item.price.replace(/\D/g, ''));
            const itemTotal = numericPrice * item.quantity;
            totalPrice += itemTotal;
 
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 15px; width: 50%;">
                        <img src="${item.img}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain;">
                        <div>
                            <h4 style="font-size: 14px; margin-bottom: 5px;">${item.name}</h4>
                            <span style="color: #d70018; font-weight: bold; font-size: 14px;">${item.price}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="changeQuantity(${index}, -1)" style="width: 28px; height: 28px; background: #ddd; border: none; border-radius: 4px; cursor: pointer;">-</button>
                        <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="width: 28px; height: 28px; background: #ddd; border: none; border-radius: 4px; cursor: pointer;">+</button>
                    </div>
                    <div>
                        <b style="color: #d70018;">${itemTotal.toLocaleString('vi-VN')} đ</b>
                    </div>
                    <button onclick="removeItem(${index})" style="background: none; border: none; color: #d70018; cursor: pointer; font-size: 16px;" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
 
        html += `
            </div>
            <div style="margin-top: 20px; background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 18px;">Tổng thanh toán: <span style="color: #d70018;">${totalPrice.toLocaleString('vi-VN')} đ</span></h3>
                <div style="display: flex; gap: 10px;">
                    <button onclick="showPage('home')" style="padding: 10px 20px; background: #ccc; color: #333; border: none; border-radius: 4px; cursor: pointer;">Tiếp tục mua sắm</button>
                    <button onclick="checkoutCart()" style="padding: 10px 20px; background: #d70018; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Tiến hành đặt hàng</button>
                </div>
            </div>
        `;
 
        cartContainer.innerHTML = html;
    }
 
    window.changeQuantity = function(index, delta) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        renderCartPage();
    };
 
    window.removeItem = function(index) {
        cart.splice(index, 1);
        saveCart();
        renderCartPage();
    };
 
    window.checkoutCart = function() {
        if (cart.length === 0) return;
 
        const newOrder = {
            id: 'HD' + Date.now().toString().slice(-6),
            date: new Date().toLocaleDateString('vi-VN'),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (Number(item.price.replace(/\D/g, '')) * item.quantity), 0)
        };
 
        orderHistory.unshift(newOrder);
        localStorage.setItem('user_orders', JSON.stringify(orderHistory));
 
        alert('Đặt hàng thành công! Đơn hàng đã được lưu vào lịch sử mua hàng.');
        cart = [];
        saveCart();
        renderCartPage();
        showPage('history');
        renderHistoryPage();
    };
 
    function renderHistoryPage() {
        const historyContainer = document.getElementById('history-content-container');
        if (!historyContainer) return;
 
        orderHistory = JSON.parse(localStorage.getItem('user_orders')) || [];
 
        if (orderHistory.length === 0) {
            historyContainer.innerHTML = `
                <p style="color: #555;">Bạn chưa có lịch sử mua hàng nào.</p>
                <button onclick="showPage('home')" style="margin-top: 20px; padding: 10px 20px; background: #1a73e8; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Về trang chủ</button>
            `;
            return;
        }
 
        let html = `<div style="display: flex; flex-direction: column; gap: 20px;">`;
 
        orderHistory.forEach(order => {
            html += `
                <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 12px; font-size: 14px;">
                        <span>Mã đơn hàng: <b>#${order.id}</b></span>
                        <span style="color: #666;">Ngày đặt: ${order.date}</span>
                        <span style="color: #28a745; font-weight: bold;">Đã đặt hàng thành công</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
            `;
 
            order.items.forEach(item => {
                const itemTotal = Number(item.price.replace(/\D/g, '')) * item.quantity;
                html += `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                        <div style="display: flex; align-items: center; gap: 10px; width: 60%;">
                            <img src="${item.img}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain;">
                            <span>${item.name} x <b>(${item.quantity})</b></span>
                        </div>
                        <span style="color: #d70018; font-weight: bold;">${itemTotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                `;
            });
 
            html += `
                    </div>
                    <div style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 12px; display: flex; justify-content: flex-end; align-items: center; gap: 15px;">
                        <span style="font-size: 15px;">Tổng tiền: <b style="color: #d70018; font-size: 16px;">${order.total.toLocaleString('vi-VN')} đ</b></span>
                    </div>
                </div>
            `;
        });
 
        html += `</div>`;
        historyContainer.innerHTML = html;
    }
 
    window.clearOrderHistory = function() {
        if (!confirm('Bạn có chắc muốn xoá toàn bộ lịch sử mua hàng?')) return;
        localStorage.removeItem('user_orders');
        orderHistory = [];
        renderHistoryPage();
    };

    const cartMenuBtn = document.querySelector('nav button[onclick*="cart"]');
    if (cartMenuBtn) {
        cartMenuBtn.addEventListener('click', () => {
            renderCartPage();
        });
    }
 
    const historyMenuBtn = document.querySelector('nav a[onclick*="history"]');
    if (historyMenuBtn) {
        historyMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('history');
            renderHistoryPage();
        });
    }
 
});