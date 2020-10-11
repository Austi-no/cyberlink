// function owlCarousel() {
//     $('.owl-carousel').owlCarousel({
//         loop: true,
//         margin: 10,
//         nav: true,
//         autoPlay: 1000,
//         items: 10,
//         responsive: {
//             0: {
//                 items: 1
//             },
//             600: {
//                 items: 3
//             },
//             1000: {
//                 items: 10
//             }
//         }
//     });

// }

function owlCarousel() {
    $(document).ready(function () {

        $(".owl-carousel").owlCarousel({
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            items: 1,
            navigation: true,
            loop: true,
            smartSpeed: 900
        });

    });
}
