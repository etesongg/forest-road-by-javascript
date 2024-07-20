/* 섹션2) 산 목록 슬라이드로 보여주기 - 시작 */
document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 6,
    spaceBetween: 30,
    centeredSlides: false,
    loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
    speed: 3000,
    effect: "slide",
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    /* 반응형 설정 */
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
    },
  });
});
/* 섹션2) 산 목록 슬라이드로 보여주기 - 끝 */

/* 섹션3) 추천코스 보여주기 - 시작*/
document.addEventListener("DOMContentLoaded", function () {
  // 기본 설정값으로 북한산 정보 표시
  showInfo("북한산");

  // 버튼 클릭 이벤트 리스너 설정
  const buttons = document.querySelectorAll(
    ".trail-recommendation-list button"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      showInfo(this.textContent);
    });
  });
});

function showInfo(place) {
  let details = {
    북한산: [
      {
        title: "비봉 코스",
        description: "고소공포증 없는 산쟁이 추천",
        difficulty: "어려움",
        time: "1시간 30분",
        distance: "3.0km",
      },
      {
        title: "백운대 코스",
        description: "북한산 정상 백운대 최단 코스",
        difficulty: "보통",
        time: "1시간 30분",
        distance: "2.0km",
      },
      {
        title: "원효봉 코스",
        description: "북한산 입문용으로 추천 코스",
        difficulty: "쉬움",
        time: "1시간 30분",
        distance: "2.7km",
      },
    ],
    설악산: [
      {
        title: "오색 코스",
        description: "조망을 잃고 정상을 빨리 만나는 코스",
        difficulty: "매우 어려움",
        time: "3시간",
        distance: "5.0km",
      },
      {
        title: "한계령 코스",
        description: "멋진 조망을 얻고 다리를 잃는 코스",
        difficulty: "어려움",
        time: "3시간 30분",
        distance: "8.3km",
      },
      {
        title: "소공원 코스",
        description: "계곡을 얻고 다리를 잃는 최장 코스",
        difficulty: "매우 어려움",
        time: "5시간",
        distance: "11.0km",
      },
    ],
    도봉산: [
      {
        title: "신선대 코스",
        description: "도봉산 정상 최단 코스",
        difficulty: "어려움",
        time: "2시간",
        distance: "3.3km",
      },
      {
        title: "오봉 코스",
        description: "멋진 뷰와 계곡길을 한번에",
        difficulty: "보통",
        time: "1시간 30분",
        distance: "3.5km",
      },
      {
        title: "우이암 코스",
        description: "초보 산쟁이 혼산 추천코스",
        difficulty: "쉬움",
        time: "1시간 30분",
        distance: "3.0km",
      },
    ],
    소백산: [
      {
        title: "어의곡 코스",
        description: "정상으로 가는 초보 추천 코스",
        difficulty: "보통",
        time: "2시간 30분",
        distance: "5.1km",
      },
      {
        title: "천동계곡 코스",
        description: "계곡을 끼고 정상으로 가는 코스",
        difficulty: "보통",
        time: "3시간",
        distance: "6.8km",
      },
      {
        title: "삼가동 코스",
        description: "주차 찬스를 쓴다면? 정상 최단 코스!",
        difficulty: "보통",
        time: "2시간 30분",
        distance: "5.5km",
      },
    ],
    한라산: [
      {
        title: "성판악 코스",
        description: "길지만 완만한 숲길을 따라 가는 코스",
        difficulty: "보통",
        time: "4시간 30분",
        distance: "9.6km",
      },
      {
        title: "관음사 코스",
        description: "가파르지만 멋진 풍경을 볼 수 있는 코스",
        difficulty: "어려움",
        time: "5시간",
        distance: "8.7km",
      },
      {
        title: "영실 코스",
        description: "윗세오름으로 가는 경치 좋은 코스",
        difficulty: "보통",
        time: "2시간 30분",
        distance: "5.8km",
      },
    ],
    관악산: [
      {
        title: "사다능선 코스",
        description: "길지만 전망이 가장 좋은 코스",
        difficulty: "어려움",
        time: "2시간 30분",
        distance: "3.8km",
      },
      {
        title: "서울대 신공학관 코스",
        description: "정상으로 가는 가장 짧고 쉬운 코스",
        difficulty: "보통",
        time: "1시간 30분",
        distance: "1.7km",
      },
      {
        title: "과천향교 코스",
        description: "시원한 계곡을 따라가는 코스",
        difficulty: "쉬움",
        time: "1시간 30분",
        distance: "3.2km",
      },
    ],
  };

  let courses = details[place];
  let content = "";

  courses.forEach((course) => {
    let difficultyClass = "";
    if (course.difficulty === "매우 어려움") {
      difficultyClass = "difficulty-very-difficult";
    } else if (course.difficulty === "어려움") {
      difficultyClass = "difficulty-difficult";
    } else if (course.difficulty === "보통") {
      difficultyClass = "difficulty-moderate";
    } else if (course.difficulty === "쉬움") {
      difficultyClass = "difficulty-easy";
    }

    content += `
      <div class="course-box">
        <div class="course-info">
          <div class="course-title">${course.title}</div>
          <div class="course-description">${course.description}</div>
        </div>
        <div class="course-details">
          <div class="detail-item difficulty ${difficultyClass}">
            <span class="icon">&#x1F4C8;</span>
            <span class="text difficulty-text">${course.difficulty}</span>
          </div>
          <div class="detail-item time">
            <span class="icon">&#x23F1;</span>
            <span class="text">${course.time}</span>
          </div>
          <div class="detail-item distance">
            <span class="icon">&#x1F6B6;</span>
            <span class="text">${course.distance}</span>
          </div>
        </div>
      </div>
      `;
  });

  document.getElementById("recommendation-details").innerHTML = content;
}
/* 섹션3) 추천코스 보여주기 - 끝 */

/* 테마별 코스 큐레이션 모달창 - 시작 */
document.addEventListener("DOMContentLoaded", function () {
  // 모달 요소 가져오기
  var modal = document.getElementById("modal");
  var modalImage = document.getElementById("modal-image");
  var modalImageTitle = document.getElementById("modal-image-title"); // 추가된 부분
  var modalDescription = document.getElementById("modal-description");
  var additionalInfo = document.getElementById("additional-info");

  // 글씨 박스 요소 가져오기
  var courseItems = document.querySelectorAll(".main-theme-course-item");

  // 닫기 버튼 요소 가져오기
  var span = document.getElementsByClassName("close")[0];

  // 글씨 박스를 클릭했을 때 모달을 보이게 하기
  courseItems.forEach(function (item) {
    item.onclick = function () {
      modal.style.display = "block";
      modalImage.src = this.querySelector("img").src;
      modalImageTitle.textContent = this.getAttribute("data-title");
      modalDescription.textContent = this.getAttribute("data-description");

      // 추가 정보를 추가하는 부분
      var additionalImage = this.getAttribute("data-additional-image");
      var additionalInfoText = this.getAttribute("data-additional-info");
      additionalInfo.innerHTML = `<img src="${additionalImage}" alt="Additional Image"><p>${additionalInfoText}</p>`;
    };
  });

  // 닫기 버튼을 클릭했을 때 모달을 숨기기
  span.onclick = function () {
    modal.style.display = "none";
  };

  // 모달 외부를 클릭했을 때 모달을 숨기기
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
/* 테마별 코스 큐레이션 모달창 - 끝 */
