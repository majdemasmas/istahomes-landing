$(document).ready(function () {
  $('.phoneInput').intlTelInput({
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.min.js",
    nationalMode: false,
    separateDialCode: false,
    initialCountry: "auto",
    geoIpLookup: callback => {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(data => callback(data.country_code))
        .catch(() => callback("tr"));
    },
    preferredCountries: [
      "SA",
      "TR",
      "KW",
      "IQ",
      "QA",
      "BH",
      "SY",
      "EG",
      "OM",
    ],
  })

  $('.NumericOnly').keydown(function (event) {
    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 ||
      event.keyCode == 27 || event.keyCode == 13 ||
      (event.keyCode == 65 && event.ctrlKey === true) ||
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return
    }
    else {
      if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) &&
        (event.keyCode < 96 || event.keyCode > 105)) {
        event.preventDefault()
      }
    }
  })

  $(".modal").on("shown.bs.modal", function () {
    var e = "#" + $(this).attr("id")
    history.pushState(null, null, e)
  })

  $(window).on("popstate", function () {
    $(".modal").modal("hide")
  })

  $(".btn-send").on("click", function (e) {
    e.preventDefault();
    var lang = $("html").attr("lang"),
      nameValid = "الرجاء ادخال الاسم",
      numberValid = " الرجاء ادخال رقم هاتف صالح";
    if (lang == "tr") {
      nameValid = "Lütfen Ad Giriniz"
      numberValid = "Lütfen geçerli Telefon numarasını girin"
    } else if (lang == "en") {
      nameValid = "Please Enter Name"
      numberValid = "Please Enter Phone number valid"
    } else if (lang == "fa") {
      nameValid = "لطفا نام را وارد کنید"
      numberValid = "لطفا شماره تلفن معتبر را وارد کنید"
    }

    var $this = $(this).parents("form"),
      emailDo = $this.find('input[name=do]').val(),
      utm_source = $this.find('input[name=utm_source]').val(),
      utm_campaign = $this.find('input[name=utm_campaign]').val(),
      name = $this.find('input[name=name]').val(),
      email = $this.find('input[name=email]').val(),
      mobile_number_with_code = $this.find('input[name=phone]').intlTelInput('getNumber'),
      message = $this.find('textarea[name=description]').val(),
      validNum = $this.find("input[name=phone]").intlTelInput("isValidNumber"),
      data = {
        'do': emailDo,
        // 'test' : 1,
        'utm_source': utm_source,
        'utm_campaign': utm_campaign,
        'utm_source': utm_source,
        'name': name,
        'email': email,
        'mobile_number': mobile_number_with_code,
        'message': message,
      };

    if (name == "") {
      alert(nameValid)
    } else if (!validNum) {
      alert(numberValid)
    } else {
      $.ajax({
        url: "https://www.isthomes.com/mail.php",
        method: 'POST',
        dataType: 'json',
        data,
        success: function (data) {
          if (data.status == "success") {
            $(".thanks-modal").modal("show")
            $(".contact-modal").modal("hide")
          }
        },
        error: function (data) {
          console.log(data)
        }
      })
    }
  })
})
