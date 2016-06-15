'use strict'; module.exports = angular.module("starter.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("home-noti.html","<ion-view view-title=\"알림판\">\n  <ion-content>\n    <ion-refresher\n        pulling-text=\"로딩중...\"\n        on-refresh=\"doRefresh()\">\n    </ion-refresher>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"header.length > 0\">\n        <i class=\"icon ion-quote\"></i>\n        {{header}}\n      </div>\n\n      <li class=\"item item-icon-right\" ng-repeat=\"noti in notis track by noti.id\">\n        <h2 ng-if=\"noti.lecture\">{{::noti.lecture.course.name}}, {{::noti.lecture.instructor.name}}</h2>\n        <p>{{::noti.content}}</p>\n        <i class=\"icon icon-accessory last-history\">\n          <span class=\"item-note\" am-time-ago=\"noti.created_at | toTime\"></span>\n        </i>\n      </li>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("hot-lectures.html","<ion-view cache-view=\"false\">\n  <ion-nav-title>즐겨찾기 TOP {{lectures.length}}</ion-nav-title>\n  <ion-content>\n    <ion-refresher\n        pulling-text=\"로딩중...\"\n        on-refresh=\"doRefresh()\">\n    </ion-refresher>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"header.length > 0\">\n        <i class=\"icon ion-quote\"></i>\n        {{header}}\n      </div>\n\n      <a class=\"item item-icon-right\" ng-repeat=\"lecture in lectures track by lecture.id\" ng-click=\"showLecture({{::lecture.id}})\">\n        <h2>{{::($index + 1)}}. {{::lecture.course.name}}, {{::lecture.instructor.name}}</h2>\n        <p>신청현황 <ng-quota cur=\"{{::lecture.current}}\" quota=\"{{::lecture.current_quota}}\">{{::lecture.current}}/{{::lecture.quota}}<span ng-if=\"::(lecture.quota != lecture.current_quota)\">(재학생 {{::lecture.current_quota}}명)</span></ng-quota>, {{::lecture.course.code}}({{::lecture.code}})</p>\n        <i class=\"icon icon-accessory last-history\">\n          <span class=\"item-note\" am-time-ago=\"lecture.last_history.created_at | toTime\"></span>\n        </i>\n        <i class=\"icon ion-chevron-right icon-accessory\">\n        </i>\n      </a>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("intro.html","<style>\nbody {\n  cursor: url(\'http://ionicframework.com/img/finger.png\'), auto;\n}\n.slider {\n  height: 100%;\n}\n.slider-slide {\n  padding-top: 80px;\n  color: #000;\n  background-color: #fff;\n  text-align: center;\n\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif; \n  font-weight: 300;\n}\n\n#logo {\n  margin: 30px 0px;\n}\n\n#list {\n  width: 170px;\n  margin: 30px auto;\n  font-size: 20px;\n}\n#list ol {\n  margin-top: 30px;\n  margin-bottom: 30px;\n}\n#list ol li {\n  text-align: left;\n  list-style: decimal;\n  margin: 10px 0px;\n}\n\n.button.ng-hide{\n  display:none;\n}\n</style>\n\n<ion-view title=\"샤이썬\">\n  <ion-content overflow-scroll=\"true\" padding=\"true\" class=\"has-header\">\n\n    <div class=\"spacer\"></div>\n\n    <ion-slide-box>\n\n      <!-- Slide page one -->\n      <ion-slide>\n        <h3 class=\"text-center\">샤이썬은</h3>\n        <p class=\"text-center\">서울대학교 수강신청 빈자리 알리미입니다.</p>\n        <div class=\"row\">\n          <div class=\"col col-50 col-offset-25\">\n            <img class=\"full-image\" style=\"max-width: 400px;\" src=\"img/icon.png\">\n          </div>\n        </div>\n      </ion-slide>\n\n      <ion-slide>\n        <h3>샤이썬의 기능은</h3>\n        <div id=\"list\">\n          <h5>아직 초기 단계이지만:</h5>\n          <ol>\n            <li>빈자리 알림</li>\n            <li>일정(수강편람 공개, 수강신청 일) 알림</li>\n            <li>각종 통계 자료(빈자리 변동 현황)</li>\n            <li>sugang.snu.ac.kr 자동 로그인</li>\n            <li>강의 교환 장터 제공</li>\n          </ol>\n          <h5>을 지원합니다.</h5>\n        </div>\n      </ion-slide>\n\n      <!-- Slide page two -->\n      <ion-slide>\n        <img class=\"full-image\" style=\"max-width: 600px;\" src=\"img/bg.png\"/>\n        <button class=\"button button-positive button-block icon\" style=\"max-width: 600px; margin: 15px auto;\" ng-click=\"start()\">시작하기</button>\n      </ion-slide>\n\n      <!-- More slides here... -->\n    </ion-slide-box>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("lecture-detail.html","<ion-view cache-view=\"false\">\n  <ion-nav-title>{{lecture.course.name}} - {{lecture.instructor.name}}</ion-nav-title>\n  <ion-nav-buttons side=\"right\">\n    <a class=\"button button-icon\" ng-class=\"{\'ion-ios-star-outline\': !lecture.isBookmarked, \'ion-ios-star\': lecture.isBookmarked}\" ng-click=\"toggle(lecture.id)\"></a>\n  </ion-nav-buttons>\n  <ion-content class=\"padding\">\n    <div class=\"scroll\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <h4><ng-quota cur=\"{{lecture.current}}\" quota=\"{{lecture.current_quota}}\">현재 {{lecture.current}}명</ng-quota> / 정원 {{lecture.quota}}명<span ng-if=\"lecture.quota != lecture.current_quota\">(재학생 {{lecture.current_quota}}명)</span></h4>\n      <p></p>\n\n      <div class=\"button-bar bar-stable lecture-detail\">\n        <a class=\"button\" ng-class=\"{\'button-positive\': tab==1}\" ng-click=\"tabChanged(1)\">통계</a>\n        <a class=\"button\" ng-class=\"{\'button-positive\': tab==2}\" ng-click=\"tabChanged(2)\">정보</a>\n      </div>\n\n      <div class=\"list\" ng-if=\"tab == 1\">\n        <li class=\"item item-divider\">\n          즐겨찾기 등록한 사람\n        </li>\n        <li class=\"item\">{{lecture.bookmarkCount}}명</li>\n        <li class=\"item item-divider\" ng-if=\"similar_lectures.length > 0\">\n          {{similar_header}}\n        </li>\n        <li class=\"item\" ng-repeat=\"l in similar_lectures track by l.id\">\n          <h2>{{::($index + 1)}}. {{::l.course.name}}, {{::l.instructor.name}}</h2>\n          <p>신청현황 <ng-quota cur=\"{{::l.current}}\" quota=\"{{::l.current_quota}}\">{{::l.current}}/{{::l.quota}}<span ng-if=\"::(l.quota != l.current_quota)\">(재학생 {{::l.current_quota}}명)</span></ng-quota>, {{::l.course.code}}({{::l.code}})</p>\n        </li>\n        <li class=\"item item-divider\">\n          최근 변동 사항\n        </li>\n        <li class=\"item\" ng-if=\"lecture.lecture_histories.length == 0\">\n          데이터 없음\n        </li>\n        <li class=\"item\" ng-repeat=\"h in lecture.lecture_histories track by h.id\">\n          {{::h.content}}\n          <br><span am-time-ago=\"h.created_at | toTime\"></span> \n        </li>\n      </div>\n      <div class=\"list\" ng-if=\"tab == 2\">\n        <li class=\"item item-divider\">\n          교과목번호(강좌번호)\n        </li>\n        <li class=\"item\">\n          [{{lecture.course.course_type | courseType2Str }}, {{lecture.course.credit}}학점] {{lecture.course.code}}({{lecture.code}})\n        </li>\n        <li class=\"item item-divider\">\n          주담당교수\n        </li>\n        <li class=\"item\">\n          {{lecture.instructor.name}}({{lecture.instructor.department.name}}, {{lecture.instructor.college.name}})\n        </li>\n        <li class=\"item item-divider\" ng-if=\"lecture.lang.length > 0\">\n          강의 언어\n        </li>\n        <li class=\"item\" ng-if=\"lecture.lang.length > 0\">\n          {{lecture.lang}}\n        </li>\n        <li class=\"item item-divider\">\n          강의 대상(권장)\n        </li>\n        <li class=\"item\">\n        {{lecture.course.status}}<span ng-if=\"lecture.course.academic_year > 0\">({{lecture.course.academic_year}}학년)</span>\n        </li>\n        <li class=\"item item-divider\" ng-if=\"lecture.remark.length > 0\">\n         비고\n        </li>\n        <li class=\"item\" ng-if=\"lecture.remark.length > 0\">\n          <p class=\"multiline-p\">{{lecture.remark}}</p>\n        </li>\n        <li class=\"item item-divider\">\n          강의실 / 시간\n        </li>\n        <li class=\"item\" ng-repeat=\"time in lecture.time_arr track by $index\">\n          {{::lecture.location_arr[$index]}} / {{::time}}\n        </li>\n      </div>\n    </div>\n  </ion-content>\n\n  <ion-footer-bar class=\"bar-stable bar bar-footer has-tabs\">\n    <button class=\"button\" ng-click=\"openLecture(lecture)\">\n      수강편람보기\n    </button>\n    <button class=\"button\" ng-click=\"sendMail(lecture)\">\n      초안지쓰기\n    </button>\n    <button class=\"button\" ng-click=\"registerLecture(lecture)\">\n      수강신청하기\n    </button>\n  </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("modal-course-detail.html","<ion-modal-view ng-controller=\"CourseDetailCtrl\" ng-init=\"init()\">\n  <ion-header-bar class=\"bar-positive fix-buttons\">\n    <a class=\"button\" ng-click=\"close()\">\n      <i class=\"icon ion-close\"></i>\n    </a>\n    <h1 class=\"title\">{{lecture.course.name}} - {{lecture.instructor.name}}</h1>\n    <a class=\"button button-icon\" ng-class=\"{\'ion-ios-star-outline\': !lecture.isBookmarked, \'ion-ios-star\': lecture.isBookmarked}\" ng-click=\"toggle(lecture.id)\"></a>\n  </ion-header-bar>\n  <ion-content class=\"padding\">\n    <div class=\"scroll\">\n    </div>\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("modal-instructor-detail.html","<ion-modal-view ng-controller=\"InstructorDetailCtrl\" ng-init=\"init()\">\n  <ion-header-bar class=\"bar-positive fix-buttons\">\n    <a class=\"button\" ng-click=\"close()\">\n      <i class=\"icon ion-close\"></i>\n    </a>\n    <h1 class=\"title\">{{lecture.course.name}} - {{lecture.instructor.name}}</h1>\n    <a class=\"button button-icon\" ng-class=\"{\'ion-ios-star-outline\': !lecture.isBookmarked, \'ion-ios-star\': lecture.isBookmarked}\" ng-click=\"toggle(lecture.id)\"></a>\n  </ion-header-bar>\n  <ion-content class=\"padding\">\n    <div class=\"scroll\">\n    </div>\n  </ion-content>\n</ion-modal-view>\n");
$templateCache.put("modal-lecture-detail.html","<ion-modal-view ng-controller=\"LectureDetailCtrl\" ng-init=\"init()\">\n  <ion-header-bar class=\"bar-positive fix-buttons\">\n    <a class=\"button modal-button\" ng-click=\"close()\">\n      <i class=\"icon ion-close\"></i>\n    </a>\n    <h1 class=\"title\">{{lecture.course.name}} - {{lecture.instructor.name}}</h1>\n    <a class=\"button button-icon modal-button\" ng-class=\"{\'ion-ios-star-outline\': !lecture.isBookmarked, \'ion-ios-star\': lecture.isBookmarked}\" ng-click=\"toggle(lecture.id)\"></a>\n  </ion-header-bar>\n  <ion-content class=\"padding\">\n    <div class=\"scroll\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div ng-if=\"lecture.drop_str.length > 0\" class=\"drop-str\">\n        <h2 class=\"assertive text-center\">{{lecture.drop_str}}</h2>\n        <p class=\"text-center\">{{lecture.max_current}}명 -> {{lecture.current}}명</p>\n      </div>\n\n      <h4><ng-quota cur=\"{{lecture.current}}\" quota=\"{{lecture.current_quota}}\">현재 {{lecture.current}}명</ng-quota> / 정원 {{lecture.quota}}명<span ng-if=\"lecture.quota != lecture.current_quota\">(재학생 {{lecture.current_quota}}명)</span></h4>\n      <p></p>\n\n      <div class=\"button-bar bar-stable lecture-detail\">\n        <a class=\"button\" ng-class=\"{\'button-positive\': tab==1}\" ng-click=\"tabChanged(1)\">통계</a>\n        <a class=\"button\" ng-class=\"{\'button-positive\': tab==2}\" ng-click=\"tabChanged(2)\">정보</a>\n      </div>\n\n      <div class=\"list\" ng-if=\"tab == 1\">\n        <li class=\"item item-divider\">\n        <i class=\"icon ion-person-stalker\"></i>\n        즐겨찾기 등록한 사람<span ng-if=\"lecture.bookmarkCount > 0.1 * lecture.quota\" class=\"assertive\">이 너무 많아요 :(</span>\n        </li>\n        <li class=\"item\">{{lecture.bookmarkCount}}명</li>\n        <li class=\"item item-divider\" ng-if=\"similar_lectures.length > 0\">\n          <i class=\"icon ion-easel\"></i>\n          {{similar_header}}\n        </li>\n        <li class=\"item item-icon-right\" ng-repeat=\"l in similar_lectures track by l.id\" ng-click=\"showLecture({{::l.id}})\">\n          <h2>{{::($index + 1)}}. {{::l.course.name}}, {{::l.instructor.name}}</h2>\n          <p>신청현황 <ng-quota cur=\"{{::l.current}}\" quota=\"{{::l.current_quota}}\">{{::l.current}}/{{::l.quota}}<span ng-if=\"::(l.quota != l.current_quota)\">(재학생 {{::l.current_quota}}명)</span></ng-quota>, {{::l.course.code}}({{::l.code}})</p>\n          <i class=\"icon icon-accessory last-history\">\n            <span class=\"item-note\" am-time-ago=\"l.last_history.created_at | toTime\"></span>\n          </i>\n          <i class=\"icon ion-chevron-right icon-accessory\">\n          </i>\n        </li>\n        <li class=\"item item-divider\">\n          <i class=\"icon ion-clock\"></i>\n          최근 변동 사항\n        </li>\n        <li class=\"item\" ng-if=\"lecture.lecture_histories.length == 0\">\n          데이터 없음\n        </li>\n        <li class=\"item\" ng-repeat=\"h in lecture.lecture_histories track by h.id\">\n          <p class=\"multiline-p\">{{::h.content}}</p>\n          <span am-time-ago=\"h.created_at | toTime\"></span> \n        </li>\n      </div>\n      <div class=\"list\" ng-if=\"tab == 2\">\n        <li class=\"item item-divider\">\n          <i class=\"icon ion-information\"></i>\n          교과목번호(강좌번호)\n        </li>\n        <li class=\"item\">\n          [{{lecture.course.course_type | courseType2Str }}, {{lecture.course.credit}}학점] {{lecture.course.code}}({{lecture.code}})\n        </li>\n        <li class=\"item item-divider\">\n          <i class=\"icon ion-person\"></i>\n          주담당교수\n        </li>\n        <li class=\"item\">\n          {{lecture.instructor.name}}({{lecture.instructor.department.name}}, {{lecture.instructor.college.name}})\n        </li>\n        <li class=\"item item-divider\" ng-if=\"lecture.lang.length > 0\">\n          <i class=\"icon ion-earth\"></i>\n          강의 언어\n        </li>\n        <li class=\"item\" ng-if=\"lecture.lang.length > 0\">\n          {{lecture.lang}}\n        </li>\n        <li class=\"item item-divider\">\n          <i class=\"icon ion-person-stalker\"></i>\n          강의 대상(권장)\n        </li>\n        <li class=\"item\">\n        {{lecture.course.status}}<span ng-if=\"lecture.course.academic_year > 0\">({{lecture.course.academic_year}}학년)</span>\n        </li>\n        <li class=\"item item-divider\" ng-if=\"lecture.remark.length > 0\">\n          <i class=\"icon ion-quote\"></i>\n         비고\n        </li>\n        <li class=\"item\" ng-if=\"lecture.remark.length > 0\">\n          <p class=\"multiline-p\">{{lecture.remark}}</p>\n        </li>\n        <li class=\"item item-divider\">\n          <i class=\"icon ion-calendar\"></i>\n          강의실 / 시간\n        </li>\n        <li class=\"item\" ng-repeat=\"time in lecture.time_arr track by $index\">\n          {{::lecture.location_arr[$index]}} / {{::time}}\n        </li>\n      </div>\n    </div>\n  </ion-content>\n\n  <ion-footer-bar class=\"bar-stable bar bar-footer has-tabs\">\n    <button class=\"button\" ng-click=\"openLecture(lecture)\">\n      수강편람보기\n    </button>\n    <button class=\"button\" ng-click=\"sendMail(lecture)\">\n      <span ng-class=\"{\'assertive\': lecture.bookmarkCount > 0.1 * lecture.quota}\"><strong>초안지쓰기</strong></span>\n    </button>\n    <button class=\"button\" ng-click=\"registerLecture(lecture)\">\n      수강신청하기\n    </button>\n  </ion-footer-bar>\n</ion-modal-view>");
$templateCache.put("more-auto.html","<ion-view view-title=\"자동 로그인 설정\" cache-view=\"false\">\n  <ion-nav-buttons side=\"right\">\n    <a class=\"button\" ng-click=\"init()\">\n      초기화하기\n    </a>\n  </ion-nav-buttons>\n  <ion-content>\n    <div class=\"list\">\n      <label class=\"item\" ng-if=\"isSet && oldTs > 0\">\n        마지막 로그인 시간\n        <span class=\"item-note\">\n          <span am-time-ago=\"oldTs | amFromUnix\"></span>\n        </span>\n      </label>\n      <div class=\"padding\" ng-if=\"isSet && oldTs > 0\">\n        <button ng-click=\"initTime()\" class=\"button button-positive button-small button-block\">재설정하기</button>\n      </div>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">학번</span>\n        <input type=\"text\" placeholder=\"수강신청 학번\" ng-model=\"form.id\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">비밀번호</span>\n        <input type=\"password\" placeholder=\"수강신청 비밀번호\" ng-model=\"form.password\">\n      </label>\n      <div class=\"padding\">\n        <button ng-click=\"save()\" class=\"button button-positive button-block\" ng-disabled=\"!(form.id.length > 0 && form.password.length > 0)\">저장하기</button>\n      </div>\n    </div>\n    <div class=\"card\">\n      <div class=\"item item-text-wrap\">\n        *학번 및 비밀번호는 앱 내부에만 저장되며 절대로 서버로 전송되지 않습니다. 오직 sugang.snu.ac.kr 자동 로그인에만 사용됩니다.\n      </div>\n      <div class=\"item item-text-wrap\">\n        *자동 로그인 기능은 강의 정보 페이지의 하단 탭(\'수강신청하기\' 버튼)을 확인해주세요.\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("more-noti.html","<ion-view view-title=\"변동사항\">\n  <ion-content>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"header.length > 0\">\n        <i class=\"icon ion-quote\"></i>\n        {{header}}\n      </div>\n\n      <a class=\"item item-icon-right\" ng-repeat=\"noti in notis track by noti.id\" ng-click=\"showLecture({{::noti.lecture.id}})\">\n        <h2>{{::($index + 1)}}. {{::noti.lecture.course.name}}, {{::noti.lecture.instructor.name}}</h2>\n        <p>{{::noti.content}}</p>\n        <i class=\"icon icon-accessory last-history\">\n          <span class=\"item-note\" am-time-ago=\"noti.lecture.last_history.created_at | toTime\"></span>\n        </i>\n        <i class=\"icon ion-chevron-right icon-accessory\">\n        </i>\n      </a>\n    </div>\n  </ion-content>\n</ion-view>");
$templateCache.put("more-profile.html","<ion-view view-title=\"프로필 설정\">\n  <ion-content>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <label class=\"item item-input item-select\">\n        <span class=\"input-label\">입학년도</span>\n        <select ng-model=\"profileForm.year\">\n          <option value=\"\">선택해주세요</option>\n          <option ng-repeat=\"year in years\" value=\"{{year}}\" ng-selected=\"year == profileForm.year\">{{year}}년</option>\n        </select>\n      </label>\n      <label class=\"item item-input item-select\">\n        <span class=\"input-label\">학적</span>\n        <select ng-model=\"profileForm.state\">\n          <option value=\"\">선택해주세요</option>\n          <option value=\"graduate\">학부생</option>\n          <option value=\"master\">석사</option>\n          <option value=\"doctor\">박사</option>\n        </select>\n      </label>\n      <div class=\"padding\">\n        <button ng-click=\"save()\" class=\"button button-positive button-block\" ng-disabled=\"!(profileForm.year.length > 0 && profileForm.state.length > 0)\">저장하기</button>\n      </div>\n    </div>\n    <div class=\"card\">\n      <div class=\"item item-text-wrap\">\n        *불필요한 알림을 받지 않기 위해서 설정합니다. 예를 들어, 프로필 설정 이후에는 신입생 수강신청 알림은 재학생에게 발송되지 않습니다.\n      </div>\n    </div>\n  </ion-content>\n</ion-view>");
$templateCache.put("more-tips.html","<ion-view view-title=\"학교 생활 TIP\" cache-view=\"false\">\n  <ion-content>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"header.length > 0\">\n        <i class=\"icon ion-quote\"></i>\n        {{header}}\n      </div>\n\n      <li class=\"item item-icon-right\" ng-repeat=\"tip in tips track by tip.id\" ng-click=\"openExternal(\'{{::tip.url}}\')\">\n        <h2>{{::($index + 1)}}. {{::tip.name}}</h2>\n        <p>{{::tip.description}}. {{::tip.by}}에 의해 등록</p>\n        <i class=\"icon ion-chevron-right icon-accessory\">\n        </i>\n      </li>\n    </div>\n    <div class=\"card\" ng-if=\"notice.length > 0\">\n      <div class=\"item item-text-wrap\">\n        {{notice}}\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("post-create.html","<ion-view view-title=\"글쓰기\">\n  <ion-content>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">제목</span>\n        <input type=\"text\" placeholder=\"필수\" ng-model=\"form.title\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">내용</span>\n        <textarea placeholder=\"필수\" ng-model=\"form.content\">\n        </textarea>\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">오픈채팅 링크</span>\n        <input type=\"url\" placeholder=\"연락수단\" ng-model=\"form.link\">\n      </label>\n      <div class=\"padding\">\n        <button ng-click=\"write()\" class=\"button button-positive button-block\" ng-disabled=\"!(form.title.length > 0 && form.content.length > 0)\">글쓰기</button>\n      </div>\n    </div>\n    <div class=\"card\">\n      <div class=\"item item-text-wrap\">\n        *강의를 사고 파는 행위는 금지되어있습니다. \n        관련 내용이 포함된 게시물은 임의로 삭제될 수 있으니 유의하시기 바랍니다.\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("post-detail.html","<ion-view>\n  <ion-nav-title>{{post.title}} <span ng-if=\"post.lecture\">- {{post.lecture.instructor.name}}</span></ion-nav-title>\n  <ion-nav-buttons side=\"right\">\n    <a class=\"button\" ng-click=\"contact()\">\n      연락하기\n    </a>\n  </ion-nav-buttons>\n  <ion-content class=\"padding\">\n    <div class=\"scroll\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <h4 class=\"post-title\">{{post.title}}</h4>\n      <p>{{post.content}}</p>\n      <p class=\"text-right post-date dark\">\n        <span am-time-ago=\"post.created_at | toTime\"></span> 작성\n      </p>\n      <div ng-if=\"post.link\">\n        <p>오픈채팅 링크</p>\n        <p>{{post.link}}</p>\n      </div>\n\n      <div class=\"list\">\n        <a class=\"item item-divider item-accessory item-icon-right\" ng-click=\"refreshComments()\">\n          <i class=\"icon ion-chatbubble\"></i>\n          <p>댓글 {{post.comments.length}}개</p>\n          <i class=\"icon icon-accessory\" ng-if=\"!loaded\">\n            로딩중...\n          </i>\n          <i class=\"icon ion-refresh icon-accessory\" ng-if=\"loaded\">\n          </i>\n        </a>\n        <div class=\"item\" ng-if=\"post.comments.length == 0\">\n          <p class=\"multiline-p text-center\">첫 댓글을 작성해주세요!!</p>\n        </div>\n        <div class=\"item item-icon-right\" ng-repeat=\"comment in post.comments track by comment.id\">\n          <p>{{::comment.content}}</p>\n          <i class=\"icon icon-accessory last-history-only-text\">\n            <span class=\"item-note\" am-time-ago=\"comment.created_at | toTime\"></span>\n          </i>\n        </div>\n      </div>\n\n      <div class=\"list\">\n        <label class=\"item item-input item-stacked-label\">\n          <span class=\"input-label\">댓글 쓰기</span>\n          <textarea ng-model=\"form.content\" ng-disabled=\"blocked\">\n          </textarea>\n        </label>\n        <button ng-click=\"write()\" class=\"button button-positive button-block\" ng-if=\"form.content.length >= 0\" ng-disabled=\"blocked || !(form.content.length > 0)\">글쓰기</button>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("tab-bookmark.html","<ion-view view-title=\"즐겨찾기\" cache-view=\"false\">\n  <ion-nav-buttons side=\"right\">\n    <a class=\"button\" href=\"#/tab/bookmark/hot\">HOT</a>\n  </ion-nav-buttons>\n  <ion-content>\n    <ion-refresher\n        pulling-text=\"로딩중...\"\n        on-refresh=\"doRefresh()\">\n    </ion-refresher>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"header.length > 0\">\n        <i class=\"icon ion-star\"></i>\n        {{header}}\n      </div>\n\n      <div class=\"item\" ng-if=\"lectures.length == 0\">\n        <p class=\"multiline-p text-center\">\n        강의 상세 페이지에서 즐겨찾기<i class=\"icon ion-star\"></i>를 해주세요!!\n        </p>\n      </div>\n\n      <a class=\"item item-icon-right\" ng-repeat=\"lecture in lectures track by lecture.id\" ng-click=\"showLecture({{::lecture.id}})\">\n        <h2>{{::($index + 1)}}. {{::lecture.course.name}}, {{::lecture.instructor.name}}</h2>\n        <p>신청현황 <ng-quota cur=\"{{::lecture.current}}\" quota=\"{{::lecture.current_quota}}\">{{::lecture.current}}/{{::lecture.quota}}<span ng-if=\"::(lecture.quota != lecture.current_quota)\">(재학생 {{::lecture.current_quota}}명)</span></ng-quota>, {{::lecture.course.code}}({{::lecture.code}})</p>\n        <i class=\"icon icon-accessory last-history\">\n          <span class=\"item-note\" am-time-ago=\"lecture.last_history.created_at | toTime\"></span>\n        </i>\n        <i class=\"icon ion-chevron-right icon-accessory\">\n        </i>\n      </a>\n\n      <div class=\"item item-empty\" ng-if=\"recommend_header.length > 0\">\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"recommend_header.length > 0\">\n        <i class=\"icon ion-thumbsup\"></i>\n        {{recommend_header}}\n      </div>\n\n      <a class=\"item item-icon-right\" ng-repeat=\"lecture in recommend_lectures track by lecture.id\" ng-click=\"showLecture({{::lecture.id}})\">\n        <h2>{{::($index + 1)}}. {{::lecture.course.name}}, {{::lecture.instructor.name}}</h2>\n        <p>신청현황 <ng-quota cur=\"{{::lecture.current}}\" quota=\"{{::lecture.current_quota}}\">{{::lecture.current}}/{{::lecture.quota}}<span ng-if=\"::(lecture.quota != lecture.current_quota)\">(재학생 {{::lecture.current_quota}}명)</span></ng-quota>, {{::lecture.course.code}}({{::lecture.code}})</p>\n        <i class=\"icon icon-accessory last-history\">\n          <span class=\"item-note\" am-time-ago=\"lecture.last_history.created_at | toTime\"></span>\n        </i>\n        <i class=\"icon ion-chevron-right icon-accessory\">\n        </i>\n      </a>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("tab-home.html","<ion-view>\n  <ion-nav-title>\n    <span ng-click=\"showPeriodForm()\">{{season}} <i class=\"icon ion-arrow-down-b\" ng-if=\"season.length > 0\"></i></span>\n  </ion-nav-title>\n  <ion-nav-buttons side=\"right\">\n    <a ng-if=\"mode==\'search\'\" class=\"button\" ng-click=\"init()\">\n      <i class=\"icon ion-close\"></i>\n    </a>\n    <a ng-if=\"mode!=\'search\'\" class=\"button\" ng-click=\"goToNoti()\">\n      <i class=\"icon ion-android-notifications-none\" ng-if=\"unread <= 0\"></i>\n      <i class=\"icon ion-android-notifications stable\" ng-if=\"unread > 0\"></i>\n    </a>\n  </ion-nav-buttons>\n  <ion-content>\n    <ion-refresher\n        pulling-text=\"로딩중...\"\n        on-refresh=\"doRefresh()\">\n    </ion-refresher>\n\n    <img ng-if=\"banner.image\" ng-src=\"{{banner.image}}\" class=\"full-image\" ng-click=\"openAd({{banner}})\" />\n    <div class=\"bar bar-header item-input-inset\">\n      <label class=\"item-input-wrapper\">\n        <i class=\"icon ion-ios-search placeholder-icon\"></i>\n        <input type=\"search\" placeholder=\"대학영어 or 031.001\" ng-model=\"searchForm.query\" ng-enter=\"search(searchForm.query)\">\n      </label>\n      <button class=\"button button-clear\" ng-class=\"{\'button-positive\': searchForm.query.length > 0}\" ng-click=\"search(searchForm.query)\">\n        검색\n      </button>\n    </div>\n\n    <div class=\"padding padding-abb bg-white\" ng-if=\"abb.length > 0\">\n      <button class=\"button button-clear button-xsmall button-dark\">{{abbText}}</button>\n      <button class=\"button button-outline button-positive button-xsmall\" ng-repeat=\"a in abb\" ng-click=\"search(a)\">\n        {{::a}}\n      </button>\n      <button class=\"button button-outline button-xsmall button-dark\" ng-click=\"showAbbModal()\" ng-if=\"mode==\'search\'\">축약어 추가하기</button>\n    </div>\n\n    <div class=\"padding padding-abb\" ng-if=\"abb.length == 0 && abbText.length > 0\">\n      <button class=\"button button-clear button-xsmall button-dark\">{{abbText}}</button>\n      <button class=\"button button-outline button-xsmall button-dark\" ng-click=\"showAbbModal()\" ng-if=\"mode==\'search\'\">축약어 추가하기</button>\n    </div>\n\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"header.length > 0\">\n        <i class=\"icon ion-clock\"></i>\n        {{header}}\n      </div>\n\n      <div class=\"item\" ng-if=\"header.length > 0 && lectures.length == 0\">\n        <p class=\"multiline-p text-center\">\n          help.shython@gmail.com으로 해당 강의를 문의해주세요.\n        </p>\n      </div>\n\n      <a class=\"item item-icon-right\" ng-repeat=\"lecture in lectures\" ng-click=\"showLecture({{::lecture.id}})\">\n        <h2>{{::($index + 1)}}. {{::lecture.course.name}}, {{::lecture.instructor.name}}</h2>\n        <p>신청현황 <ng-quota cur=\"{{::lecture.current}}\" quota=\"{{::lecture.current_quota}}\">{{::lecture.current}}/{{::lecture.quota}}<span ng-if=\"::(lecture.quota != lecture.current_quota)\">(재학생 {{::lecture.current_quota}}명)</span></ng-quota>, {{::lecture.course.code}}({{::lecture.code}})</p>\n        <i class=\"icon icon-accessory last-history\">\n          <span class=\"item-note\" am-time-ago=\"lecture.last_history.created_at | toTime\"></span>\n        </i>\n        <i class=\"icon ion-chevron-right icon-accessory\">\n        </i>\n      </a>\n\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("tab-market.html","<ion-view view-title=\"강의교환\" cache-view=\"false\">\n  <ion-nav-buttons side=\"right\">\n    <a class=\"button\" href=\"#/tab/market/create\">\n      글쓰기\n    </a>\n  </ion-nav-buttons>\n  <ion-content>\n    <ion-refresher\n        pulling-text=\"로딩중...\"\n        on-refresh=\"doRefresh()\">\n    </ion-refresher>\n    <div class=\"list\">\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\" ng-if=\"header.length > 0\">\n        <i class=\"icon ion-quote\"></i>\n        {{header}}\n      </div>\n\n      <a class=\"item item-icon-right\" ng-repeat=\"post in posts track by post.id\" href=\"#/tab/market/{{::post.id}}\">\n        <h2>{{::post.title}} [{{::post.comment_count}}]</h2>\n        <p>{{::post.content}}</p>\n        <i class=\"icon icon-accessory last-history\">\n          <span class=\"item-note\" am-time-ago=\"post.created_at | toTime\"></span>\n        </i>\n        <i class=\"icon ion-chevron-right icon-accessory\">\n        </i>\n      </a>\n    </div>\n    <ion-infinite-scroll\n           ng-if=\"canBeLoaded\"\n           on-infinite=\"loadMore()\"\n           distance=\"1%\">\n    </ion-infinite-scroll>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("tab-more.html","<ion-view view-title=\"더보기\" cache-view=\"false\">\n  <ion-content>\n    <ion-list>\n      <div class=\"item item-icon-left\" ng-if=\"notice.length > 0\">\n        <h2>공지사항</h2>\n        <p class=\"multiline-p\">{{notice}}</p>\n        <i class=\"icon ion-ios-information-outline\"></i>\n      </div>\n\n      <div class=\"item item-divider\">\n        <i class=\"icon ion-gear-a\"></i>\n        계정\n      </div>\n      <a class=\"item item-icon-right\" href=\"#/tab/more/noti\" ng-if=\"false\">\n        즐찾한 강좌의 변동사항\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n      </a>\n      <a class=\"item item-icon-right\" href=\"#/tab/more/profile\">\n        프로필 설정\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n      </a>\n      <a class=\"item item-icon-right\" href=\"#/tab/more/auto\">\n        자동 로그인 설정\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n      </a>\n      <div class=\"item item-divider\">\n        <i class=\"icon ion-ios-bell\"></i>\n        알림\n      </div>\n      <ion-toggle class=\"item\" toggle-class=\"toggle-positive\" ng-model=\"options.on\" ng-change=\"change()\">\n        빈자리 알림 받기\n      </ion-toggle>\n      <div class=\"item item-divider\">\n        <i class=\"icon ion-help\"></i>\n        정보\n      </div>\n      <li class=\"item\">\n        수강편람 마지막 업데이트\n        <span class=\"item-note\">\n          {{options.updated_at}}\n        </span>\n      </li>\n      <li class=\"item\">\n        앱 버전\n        <span class=\"item-note\">\n          현재 버전 {{appVersion}}\n          <br>\n          최신 버전 {{latestVersion}}\n        </span>\n      </li>\n      <div class=\"item item-divider\">\n        <i class=\"icon ion-at\"></i>\n        CONTACT\n      </div>\n      <a class=\"item\" ng-click=\"openExternal(\'https://open.kakao.com/o/gaCfEXg\')\">\n        카카오톡\n        <span class=\"item-note\">\n          샤이썬(오픈채팅)\n        </span>\n      </a>\n      <a class=\"item\" ng-click=\"openExternal(\'https://facebook.com/snu.shython\')\">\n        페이스북 페이지\n        <span class=\"item-note\">\n          @snu.shython\n        </span>\n      </a>\n      <div class=\"item item-divider\">\n        <i class=\"icon ion-lightbulb\"></i>\n        안내\n      </div>\n      <a class=\"item item-icon-right\" href=\"#/tab/more/tips\">\n        학교 생활 TIP\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n      </a>\n      <a class=\"item item-icon-right\" ng-click=\"openExternal(\'http://sugang.snu.ac\')\">\n        웹 버전 사용하기\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n      </a>\n      <li class=\"item item-icon-right\" ng-click=\"openHelp()\">\n        도움말\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n      </li>\n      <li class=\"item item-icon-right\" ng-click=\"sendMail()\">\n        문의하기\n        <i class=\"icon ion-chevron-right icon-accessory\"></i>\n      </li>\n\n      <div class=\"item item-divider\">\n        <i class=\"icon ion-quote\"></i>\n        감사의 말\n      </div>\n\n      <div class=\"item item-icon-left\">\n        <p class=\"multiline-p\">많은 학우 분들이 이용해주셔서 스누라이프 공모전 \'SANDBOX 2016\'에서 우승을 할 수 있었습니다. 앞으로도 좋은 기능 추가하겠습니다. 감사합니다.</p>\n        <i class=\"icon energized ion-trophy\"></i>\n      </div>\n    </ion-list>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("tabs.html","<ion-tabs class=\"tabs-icon-top tabs-color-active-positive\">\n\n  <!-- Search Tab -->\n  <ion-tab title=\"검색\" icon-off=\"ion-ios-search\" icon-on=\"ion-ios-search-strong\" href=\"#/tab/home\">\n    <ion-nav-view name=\"tab-home\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Bookmark Tab -->\n  <ion-tab title=\"즐겨찾기\" icon-off=\"ion-ios-star-outline\" icon-on=\"ion-ios-star\" href=\"#/tab/bookmark\">\n    <ion-nav-view name=\"tab-bookmark\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- Market Tab -->\n  <ion-tab title=\"강의 / 책\" icon-off=\"ion-ios-cart-outline\" icon-on=\"ion-ios-cart\" href=\"#/tab/market\">\n    <ion-nav-view name=\"tab-market\"></ion-nav-view>\n  </ion-tab>\n\n  <!-- More Tab -->\n  <ion-tab title=\"더보기\" icon-off=\"ion-ios-more-outline\" icon-on=\"ion-ios-more\" href=\"#/tab/more\">\n    <ion-nav-view name=\"tab-more\"></ion-nav-view>\n  </ion-tab>\n\n</ion-tabs>\n");}]);