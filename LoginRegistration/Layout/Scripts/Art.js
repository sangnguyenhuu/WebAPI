
const _question = document.getElementById('question'); // Lấy thẻ HTML có id là 'question' và gán vào biến '_question'
const _options = document.querySelector('.quiz-options'); // Lấy thẻ HTML có class là 'quiz-options' và gán vào biến '_options'
const _checkBtn = document.getElementById('check-answer'); // Lấy thẻ HTML có id là 'check-answer' và gán vào biến '_checkBtn'
const _playAgainBtn = document.getElementById('play-again'); // Lấy thẻ HTML có id là 'play-again' và gán vào biến '_playAgainBtn'
const _result = document.getElementById('result'); // Lấy thẻ HTML có id là 'result' và gán vào biến '_result'
const _correctScore = document.getElementById('correct-score'); // Lấy thẻ HTML có id là 'correct-score' và gán vào biến '_correctScore'
const _totalQuestion = document.getElementById('total-question'); // Lấy thẻ HTML có id là 'total-question' và gán vào biến '_totalQuestion'
const _CountQuestion = document.getElementById('CountQuestion'); // Lấy thẻ HTML có id là 'CountQuestion' và gán vào biến '_CountQuestion'
const _RemainQuestion = document.getElementById('RemainQuestion'); // Lấy thẻ HTML có id là 'RemainQuestion' và gán vào biến '_RemainQuestion'
const _helpanswer = document.getElementById('help-answer');
const countdownTimer = document.getElementById("countdown-timer");
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10, CountQuestion = 0, RemainQuestion = 0, count = totalQuestion - 3; // Khởi tạo các biến
let timeLeft = 10;
// load question from API
async function loadQuestion() {  // Hàm lấy câu hỏi từ API chọn ngẫu nhiên một câu hỏi từ tập dữ liệu và hiển thị lên trang web, bao gồm câu hỏi và các phương án trả lời
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=25'; // Đường dẫn của API
    const result = await fetch(`${APIUrl}`) // Lấy kết quả từ API
    const data = await result.json(); // Chuyển kết quả thành đối tượng JSON
    _result.innerHTML = ""; // Xóa nội dung kết quả trả về trong HTML
    showQuestion(data.results[0]);// Hiển thị câu hỏi

}

// event listeners
function eventListeners() { // Hàm đăng ký các sự kiện
    _helpanswer.addEventListener('click', showHelp);
    _checkBtn.addEventListener('click', checkAnswer);  // Đăng ký sự kiện khi click vào nút kiểm tra đáp án
    _playAgainBtn.addEventListener('click', restartQuiz); // Đăng ký sự kiện khi click vào nút chơi lại
}

document.addEventListener('DOMContentLoaded', function () { // Sự kiện được gọi khi trang web được tải hoàn tất
    loadQuestion(); // Lấy câu hỏi
    eventListeners(); // Đăng ký các sự kiện
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});


// display question and options
// để hiển thị câu hỏi và các phương án lên trang web. Hàm này sẽ cho phép nút kiểm tra đáp án có thể sử dụng, 
//lưu đáp án đúng vào biến correctAnswer, lưu các đáp án sai vào biến incorrectAnswer, trộn các đáp án và 
// lưu vào optionsList, sau đó hiển thị câu hỏi và các phương án lên trang web.
function showQuestion(data) { // Hàm hiển thị câu hỏi và các phương án lên trang web
    _checkBtn.disabled = false; // Cho phép nút kiểm tra đáp án có thể sử dụng
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    // console.log(correctAnswer);


    _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}


// options selection
//Hàm selectOption() để chọn phương án. Hàm này sẽ gắn sự kiện "click" cho mỗi phương án, 
//nếu phương án đã được chọn, hàm sẽ xóa lớp "selected" của phương án đã chọn trước đó 
//và thêm lớp "selected" cho phương án đang được chọn.
function selectOption() {
    _options.querySelectorAll('li').forEach(function (option) {
        option.addEventListener('click', function () {
            if (_options.querySelector('.selected')) {
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
// Hàm checkAnswer() để kiểm tra câu trả lời của người dùng. Nếu có phương án được chọn,
//hàm sẽ tăng biến CountQuestion lên 1, tính số câu hỏi còn lại(RemainQuestion),
//lưu câu trả lời của người dùng vào selectedAnswer,
//kiểm tra câu trả lời của người dùng và thông báo kết quả cho người dùng.Nếu người dùng chưa chọn phương án nào,
//hàm sẽ hiển thị thông báo yêu cầu người dùng chọn phương án và cho phép nút kiểm tra đáp án có thể sử dụng.
function checkAnswer() {

    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {

        CountQuestion++;
        RemainQuestion = totalQuestion - CountQuestion;
        let selectedAnswer = _options.querySelector('.selected span').textContent;

        if (selectedAnswer == HTMLDecode(correctAnswer)) {

            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Câu này đúng rồi nạ!</p>`;
        } else {

            _result.innerHTML = `<p><i class = "fas fa-times"></i>Câu trả lời của bạn sai rồi hic!</p> <small><b>Đáp án đúng là: </b>${correctAnswer}</small>`;
        }
        _CountQuestion.innerHTML = `<small><b>Câu hỏi thứ : </b>${CountQuestion}</small>`;
        _RemainQuestion.innerHTML = `<small><b>Câu hỏi còn lại : </b>${RemainQuestion}</small>`;
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }

    if (correctScore == totalQuestion) {
        alert("Bạn đã chiến thắng với số điểm tuyệt đối");
    }
}

//Hàm HTMLDecode(textString) để chuyển đổi các thực thể html thành văn bản thông thường của câu trả lời đúng nếu có.
// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

// Hàm checkCount() để kiểm tra số câu hỏi đã được đặt và thông báo kết quả cho người dùng. Nếu số câu hỏi đã được đặt bằng tổng số câu hỏi, 
//hàm sẽ thông báo số điểm của người dùng và hiển thị nút chơi lại.Nếu chưa đến tổng số câu hỏi, hàm sẽ tải câu hỏi tiếp theo.
function checkCount() {
    askedCount++;
    setCount();
    if (askedCount == totalQuestion) {
        setTimeout(function () {
            console.log("");
        }, 5000);


        _result.innerHTML += `<p>Điểm của bạn là ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function () {
            loadQuestion();
        }, 1000);
    }
}
// Hàm setCount() để đặt số lượng câu hỏi và điểm số của người dùng.
function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

//Hàm restartQuiz() để bắt đầu lại trò chơi.Hàm này sẽ đặt lại số điểm 
//và số câu hỏi đã đặt về 0, ẩn nút chơi lại, hiển thị nút kiểm tra đáp án 
//và đặt lại số lượng câu hỏi và điểm số của người dùng, sau đó tải câu hỏi đầu tiên.
function restartQuiz() {
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
    _helpanswer.style.display = "block";
    CountQuestion = 0, RemainQuestion = 0;
    count = totalQuestion - 3;

}
function showHelp() {
    var confirmHelp = confirm("Bạn có chắc chắn muốn xem trợ giúp không? Và bạn còn " + count + " Lượt trợ giúp");

    if (confirmHelp == true) {
        count--;
        alert(" Đáp án là : " + correctAnswer);

        // Thực hiện thao tác hiển thị trang trợ giúp ở đây
    } else {
        // Không làm gì nếu người dùng chọn "Cancel"
    }
    if (count == 0) {
        alert("Bạn đã hết lượt trợ giúp ! Cố gắng suy nghĩ thật kĩ nha ! hihi");
        _helpanswer.style.display = "none";
    }
}
