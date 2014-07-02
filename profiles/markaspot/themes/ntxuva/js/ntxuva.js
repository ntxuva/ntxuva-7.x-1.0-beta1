(function($) {
    log = console.log;

    var HomePageStats = {
        parse: function(){
            var serviceNames  = {},
                locationNames = {},
                freqService   = {},
                freqLocation  = {},
                countClosed   = 0,
                countTime     = 0,
                hours         = 0;

            $('request', this.res).each(function(index, request){
                var $status = $('status', request);

                if ($status.length && $status.text() == 'closed') {
                    var requested_datetime = $('requested_datetime', request).text(),
                        updated_datetime   = $('updated_datetime', request).text(),
                        reqDate = new Date(requested_datetime),
                        upDate  = new Date(updated_datetime);

                    if (typeof reqDate == 'object' && typeof upDate == 'object') {
                        countClosed++;
                        countTime += Math.abs(reqDate - upDate);
                    }
                }

                var service_name = $('service_name', request).text();

                if (service_name) {
                    if (!serviceNames[service_name])
                        serviceNames[service_name] = 1;
                    else
                        serviceNames[service_name] = serviceNames[service_name] + 1;

                    if (!freqService.name || freqService.count < serviceNames[service_name])
                        freqService = {'name': service_name, 'count': serviceNames[service_name]};
                }

                var location_name = $('address_id', request).text().split(',')[0];

                if (location_name) {
                    if (!locationNames[location_name])
                        locationNames[location_name] = 1;
                    else
                        locationNames[location_name] = locationNames[location_name] + 1;

                    if (!freqLocation.name || freqLocation.count < locationNames[location_name])
                        freqLocation = {'name': location_name, 'count': locationNames[location_name]};
                }
            });

            hours = Math.floor((countTime / countClosed) / 1000 / 60 / 60);
            $('.average-hours').text(hours);
            $('.frequent-request-label').text(freqService.name);
            $('.frequent-location-label').text(freqLocation.name);
        },
        init: function(){
            var _self = this;

            if (!$('body').hasClass('front'))
                return;

            $.ajax({
                url: '/georeport/v2/requests.xml',
                success: function(res){
                    _self.res = res;
                    _self.parse();
                }
            });
        }
    };

    var ChartsPage = {
        chartColorMapping: {
            'service': {},
            'status' : {},
            'address': {}
        },
        parse: function(){
            var serviceNames  = {},
                serviceMarkup = [],

                statusNames   = {},
                statusMarkup  = [],

                addressNames  = {},
                addressMarkup = [];

            $('request', res).each(function(index, request){
                var service_name = $('service_name', request).text(),
                    status_name  = $('status', request).text(),
                    address_name = $('address_id', request).text();

                if (service_name) {
                    var serviceNameEncode = encodeURIComponent(service_name);
                    if (!serviceNames[serviceNameEncode]) {
                        serviceNames[serviceNameEncode] = 1;
                        serviceMarkup.push('<option value="' + serviceNameEncode + '">' + service_name + '</option>');
                        if (!this.chartColorMapping.service[serviceNameEncode]) {
                            this.chartColorMapping.service[serviceNameEncode] = Math.floor(Math.random()*16777215).toString(16);
                        }
                    }
                }

                if (status_name) {
                    var statusNameEncode = encodeURIComponent(status_name);
                    if (!statusNames[statusNameEncode]) {
                        statusNames[statusNameEncode] = 1;
                        statusMarkup.push('<option value="' + statusNameEncode + '">' + status_name + '</option>');

                        if (!this.chartColorMapping.status[serviceNameEncode]) {
                            this.chartColorMapping.status[serviceNameEncode] = Math.floor(Math.random()*16777215).toString(16);
                        }
                    }
                }

                if (address_name) {
                    var addressNameEncode = encodeURIComponent(address_name);
                    if (!addressNames[addressNameEncode]) {
                        addressNames[addressNameEncode] = 1;
                        addressMarkup.push('<option value="' + addressNameEncode + '">' + address_name + '</option>');

                        if (!this.chartColorMapping.address[serviceNameEncode]) {
                            this.chartColorMapping.address[serviceNameEncode] = Math.floor(Math.random()*16777215).toString(16);
                        }
                    }
                }
            });

            $('#form-select-category').append(serviceMarkup.join(''));
            $('#form-select-status').append(statusMarkup.join(''));
            $('#form-select-address').append(addressMarkup.join(''));
        },
        init: function(){
            var _self = this;

            if (!$('.relatorio-page').length)
                return;

            $.ajax({
                url: '/georeport/v2/requests.xml',
                success: function(res){
                    _self.res = res;
                    _self.parse();
                }
            });
        }
    };

    $(document).ready(function(){
        HomePageStats.init();
        ChartsPage.init();
        
        $('.field-label').addClass('label');

        $('.geolocation-address-geocode, .geolocation-client-location, .geolocation-remove').addClass('btn');

        // Hide form input's address on focus.
        $('.geolocation-address input').focus(function(){
            this.value = '';
        });

        $('.node-report-form #edit-submit').html(Drupal.t('Next'));

        var currentHash = document.location.hash.replace(/^#/, '');
        if (currentHash) {
            $('.nav-tabs a[href=#' + currentHash + ']').tab('show');
        }

        $('.nav-tabs > li > a').on('click', function(e) {
            var linkHash = e.target.hash;

            $('html, body').animate(
                {
                    scrollTop: $(linkHash).offset().top
                },
                600,
                function(){
                    window.location.hash = linkHash;
                }
            );

            if (linkHash.indexOf('3--') > -1 || linkHash.indexOf('---fotografia') > -1)  {
                $('.node-report-form #edit-submit').html(Drupal.t('Save'));
            }
            else {
                $('.node-report-form #edit-submit').html(Drupal.t('Next'));
            }
        });

        // Submit changes
        $('.node-report-form #edit-submit').click(function(e) {
            currentHash = document.location.hash.replace(/^#/, '');
            e.preventDefault();

            if (!currentHash || currentHash.indexOf('1--') > -1 || currentHash.indexOf('---local') > -1) {
                $('a:contains(2.)').tab('show');
                var hash = $('a:contains(2.)').attr('href');
                // animate
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 30
                    }, 600, function(){
                    window.location.hash = hash;
                });
            }
            else if (currentHash.indexOf('2--') > -1 || currentHash.indexOf('---relatorio') > -1) {
                $('a:contains(3.)').tab('show');

                var hash = $('a:contains(3.)').attr('href');
                // animate
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 30
                    }, 600, function(){
                    window.location.hash = hash;
                });
                document.getElementById("edit-field-geo-und-0-address-field").disabled = false;
                $('#edit-submit').html(Drupal.t('Save'));
            }
            else if (currentHash.indexOf('3--') > -1 || currentHash.indexOf('---fotografia') > -1) {
                $('form').unbind('submit').submit();
            }
        });

        //radio buttons
        var $categoriesContainer = $('.form-radios');

        function toggleCheck($radio) {
            var checked   = $radio.is(':checked'),
                $gChecked = [];

            if (checked) {
                $radio.parent().addClass('checked').siblings('.checked').removeClass('checked');
            }
            else {
                $radio.parent().removeClass('checked');
            }
        };

        $categoriesContainer.find('input.form-radio').on({
                change: function(e) {
                    toggleCheck($(this));
                },
                click: function(e) {
                    e.stopPropagation();
                },
                keyup: function() {
                    toggleCheck($(this));
                },
                focus: function(event) {
                    _self.$element.addClass('active');
                },
                blur: function(event) {
                    _self.$element.removeClass('active');
                }
            });
    });
    
    $(window).load(function(){
        $('#loading').fadeOut(0);
    });
})(jQuery);