$(document).ready(function() {





    //Документация: https://github.com/eskju/eskju-jquery-scrollflow
    new ScrollFlow();

//Попап менеджер FancyBox
	//Документация: http://fancybox.net/howto
	//<a class="fancybox"><img src="image.jpg" /></a>
	//<a class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	$(".fancybox").fancybox();

    $('.center-content_slider').slick({
        adaptiveHeight: true
    });

	//Навигация по Landing Page
	//$(".top_mnu") - это верхняя панель со ссылками.
	//Ссылки вида <a href="#contacts">Контакты</a>
	$(".top_mnu").navigation();

    $(".scroll").click(function(event){
//Перехватываем обработку по умолчанию события нажатия мыши
        event.preventDefault();

//Получаем полный url - например, mysitecom/index.htm#home
        var full_url = this.href;

//Разделяем url по символу # и получаем имя целевой секции - home в адресе mysitecom/index.htm#home
        var parts = full_url.split("#");
        var trgt = parts[1];

//Получаем смещение сверху для целевой секции
        var target_offset = $("#"+trgt).offset();
        var target_top = target_offset.top;

//Переходим в целевую секцию установкой позиции прокрутки страницы в позицию целевой секции
        $('html, body').animate({scrollTop:target_top}, 1500);
    });

	//Каруселька
	//Документация: http://owlgraphic.com/owlcarousel/
    //Каруселька About
    $("#owl-demo").owlCarousel({
            navigation : false, // Show next and prev buttons
            slideSpeed : 300,
            paginationSpeed : 400,
            singleItem:true,

            // "singleItem:true" is a shortcut for:
            itemsDesktop      : [1199,10],
            itemsDesktopSmall     : [979,10],
            itemsTablet       : [768,8],
            itemsMobile       : [479,4],
            pagination:true,
            paginationNumbers:false,
            responsiveRefreshRate : 100
    });
    $("#owl-demo-partners").owlCarousel({

        autoPlay: 3000, //Set AutoPlay to 3 seconds

        items : 4,
        itemsDesktop : [1199,3],
        itemsDesktopSmall : [979,3]

    });



    //Каруселька Slider
    var sync1 = $(".sync1");
    var sync2 = $(".sync2");

    sync1.owlCarousel({
        transitionStyle : "fade",
        singleItem : true,
        navigation: false,
        pagination:false,
        afterAction : syncPosition,
        responsiveRefreshRate : 200
    });

    sync2.owlCarousel({
        items : 6,
        itemsDesktop      : [1199,10],
        itemsDesktopSmall     : [979,10],
        itemsTablet       : [768,8],
        itemsMobile       : [479,4],
        pagination:false,
        responsiveRefreshRate : 100,
        afterInit : function(el){
            el.find(".active").eq(0).addClass("synced");
        }
    });

    function syncPosition(el){
        var current = this.currentItem;
        $(".sync2")
            .find(".active")
            .removeClass("synced")
            .eq(current)
            .addClass("synced")
        if($(".sync2").data("owlCarousel") !== undefined){
            center(current)
        }
    }

    $(".sync2").on("mousemove", ".owl-item", function(e){
        e.preventDefault();
        var number = $(this).data("owlItem");
        sync1.trigger("owl.goTo",number);
    });


	//Кнопка "Наверх"
	//Документация:
	//http://api.jquery.com/scrolltop/
	//http://api.jquery.com/animate/
	$("#top").click(function () {
		$("body, html").animate({
			scrollTop: 0
		}, 800);
		return false;
	});
	
	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	$("form").submit(function() {
		$.ajax({
			type: "GET",
			url: "mail.php",
			data: $("form").serialize()
		}).done(function() {
            $.fancybox('#inline');
			setTimeout(function() {
				$.fancybox.close();
			}, 1000);
		});
		return false;
	});

    //Фильтр
    //open/close lateral filter
    $('.cd-filter-trigger').on('click', function(){
        triggerFilter(true);
    });
    $('.cd-filter .cd-close').on('click', function(){
        triggerFilter(false);
    });

    function triggerFilter($bool) {
        var elementsToTrigger = $([$('.cd-filter-trigger'), $('.cd-filter'), $('.cd-tab-filter'), $('.cd-gallery')]);
        elementsToTrigger.each(function(){
            $(this).toggleClass('filter-is-visible', $bool);
        });
    }

    //mobile version - detect click event on filters tab
    var filter_tab_placeholder = $('.cd-tab-filter .placeholder a'),
        filter_tab_placeholder_default_value = 'Select',
        filter_tab_placeholder_text = filter_tab_placeholder.text();

    $('.cd-tab-filter li').on('click', function(event){
        //detect which tab filter item was selected
        var selected_filter = $(event.target).data('type');

        //check if user has clicked the placeholder item
        if( $(event.target).is(filter_tab_placeholder) ) {
            (filter_tab_placeholder_default_value == filter_tab_placeholder.text()) ? filter_tab_placeholder.text(filter_tab_placeholder_text) : filter_tab_placeholder.text(filter_tab_placeholder_default_value) ;
            $('.cd-tab-filter').toggleClass('is-open');

            //check if user has clicked a filter already selected
        } else if( filter_tab_placeholder.data('type') == selected_filter ) {
            filter_tab_placeholder.text($(event.target).text());
            $('.cd-tab-filter').removeClass('is-open');

        } else {
            //close the dropdown and change placeholder text/data-type value
            $('.cd-tab-filter').removeClass('is-open');
            filter_tab_placeholder.text($(event.target).text()).data('type', selected_filter);
            filter_tab_placeholder_text = $(event.target).text();

            //add class selected to the selected filter item
            $('.cd-tab-filter .selected').removeClass('selected');
            $(event.target).addClass('selected');
        }
    });

    //close filter dropdown inside lateral .cd-filter
    $('.cd-filter-block h4').on('click', function(){
        $(this).toggleClass('closed').siblings('.cd-filter-content').slideToggle(300);
    })

    //fix lateral filter and gallery on scrolling
    //$(window).on('scroll', function(){
    //    (!window.requestAnimationFrame) ? fixGallery() : window.requestAnimationFrame(fixGallery);
    //});

    //Фиксация фильтра

    //function fixGallery() {
    //    var offsetTop = $('.cd-main-content').offset().top,
    //        scrollTop = $(window).scrollTop();
    //    ( scrollTop >= offsetTop ) ? $('.cd-main-content').addClass('is-fixed') : $('.cd-main-content').removeClass('is-fixed');
    //}

    /************************************
     MitItUp filter settings
     More details:
     https://mixitup.kunkalabs.com/
     or:
     http://codepen.io/patrickkunka/
     *************************************/

    buttonFilter.init();
    $('.cd-gallery ul').mixItUp({
        controls: {
            enable: false
        },
        callbacks: {
            onMixStart: function(){
                $('.cd-fail-message').fadeOut(200);
            },
            onMixFail: function(){
                $('.cd-fail-message').fadeIn(200);
            }
        }
    });

    //search filtering
    //credits http://codepen.io/edprats/pen/pzAdg
    var inputText;
    var $matching = $();

    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $(".cd-filter-content input[type='search']").keyup(function(){
        // Delay function invoked to make sure user stopped typing
        delay(function(){
            inputText = $(".cd-filter-content input[type='search']").val().toLowerCase();
            // Check to see if input field is empty
            if ((inputText.length) > 0) {
                $('.mix').each(function() {
                    var $this = $(this);

                    // add item to be filtered out if input text matches items inside the title
                    if($this.attr('class').toLowerCase().match(inputText)) {
                        $matching = $matching.add(this);
                    } else {
                        // removes any previously matched item
                        $matching = $matching.not(this);
                    }
                });
                $('.cd-gallery ul').mixItUp('filter', $matching);
            } else {
                // resets the filter to show all item if input is empty
                $('.cd-gallery ul').mixItUp('filter', 'all');
            }
        }, 200 );
    });

    function showMore(){
        $('.hidden:lt(4)').removeClass('hidden');
    }


    $('.hidden:lt(4)').removeClass('hidden');
    $('#show-more').on('click', showMore);


});





/*****************************************************
 MixItUp - Define a single object literal
 to contain all filter custom functionality
 *****************************************************/
var buttonFilter = {
    // Declare any variables we will need as properties of the object
    $filters: null,
    groups: [],
    outputArray: [],
    outputString: '',

    // The "init" method will run on document ready and cache any jQuery objects we will need.
    init: function(){
        var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.

        self.$filters = $('.cd-main-content');
        self.$container = $('.cd-gallery ul');

        self.$filters.find('.cd-filters').each(function(){
            var $this = $(this);

            self.groups.push({
                $inputs: $this.find('.filter'),
                active: '',
                tracker: false
            });
        });

        self.bindHandlers();
    },

    // The "bindHandlers" method will listen for whenever a button is clicked.
    bindHandlers: function(){
        var self = this;

        self.$filters.on('click', 'a', function(e){
            self.parseFilters();
        });
        self.$filters.on('change', function(){
            self.parseFilters();
        });
    },

    parseFilters: function(){
        var self = this;

        // loop through each filter group and grap the active filter from each one.
        for(var i = 0, group; group = self.groups[i]; i++){
            group.active = [];
            group.$inputs.each(function(){
                var $this = $(this);
                if($this.is('input[type="radio"]') || $this.is('input[type="checkbox"]')) {
                    if($this.is(':checked') ) {
                        group.active.push($this.attr('data-filter'));
                    }
                } else if($this.is('select')){
                    group.active.push($this.val());
                } else if( $this.find('.selected').length > 0 ) {
                    group.active.push($this.attr('data-filter'));
                }
            });
        }
        self.concatenate();
    },

    concatenate: function(){
        var self = this;

        self.outputString = ''; // Reset output string

        for(var i = 0, group; group = self.groups[i]; i++){
            self.outputString += group.active;
        }

        // If the output string is empty, show all rather than none:
        !self.outputString.length && (self.outputString = 'all');

        // Send the output string to MixItUp via the 'filter' method:
        if(self.$container.mixItUp('isLoaded')){
            self.$container.mixItUp('filter', self.outputString);
        }
    }
};

