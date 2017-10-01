$(function () {
    'use strict'
	/*Eigene Einstellungen########################################################################################################*/
	//
	Store.set('showActiveRaidsOnly', false)
	Store.set('showOpenGymsOnly', false)
	Store.set('showTeamGymsOnly', 0)
	Store.set('showLastUpdatedGymsOnly', 0)
	Store.set('showScanned', false)
	Store.set('showRanges', false)
	Store.set('processPokemonChunkSize', 250)
	
	
	//TODO: remove
	if(!Store.get('remember_text_perfection_notify')) {
		Store.set('remember_text_perfection_notify', '100')
	}
			if(window.sendToastrPokemonNotification) {
			window.sendToastrPokemonNotification = function(title, text, icon, lat, lon) {
				if(!Store.get('doPush')) {
					return
				}
				var notification = toastr.info(text, title, {
					closeButton: true,
					positionClass: 'toast-top-right',
					preventDuplicates: false,
					onclick: function () {
						centerMap(lat, lon, 20)
					},
					showDuration: '300',
					hideDuration: '500',
					timeOut: '6000',
					extendedTimeOut: '1500',
					showEasing: 'swing',
					hideEasing: 'linear',
					showMethod: 'fadeIn',
					hideMethod: 'fadeOut'
				})
				notification.removeClass('toast-info')
				notification.css({
					'padding-left': '36px',
					'background-image': `url('./${icon}')`,
					'background-size': '36px',
					'background-position': 'left top',
					'background-color': '#283747',
					'height': '40px'
				})
				notification.find('.toast-title').css('font-size', 'smaller')
			};
		}
	/*###########################################################################################################################*/
    /* Settings. */

    const scaleByRarity = false // Enable scaling by rarity. Default: true.
    const upscalePokemon = true // Enable upscaling of certain Pokemon (upscaledPokemon and notify list). Default: false.
    const upscaledPokemon = [] // Add Pokémon IDs separated by commas (e.g. [1, 2, 3]) to upscale icons.

    // Google Analytics property ID. Leave empty to disable.
    // Looks like 'UA-XXXXX-Y'.
    const analyticsKey = 'UA-96781963-1'

    // MOTD.
    const motdEnabled = false
    const motdTitle = 'MOTD'
    const motd = 'Hi there! This is an easily customizable MOTD with optional title!'

    // Only show every unique MOTD message once. If disabled, the MOTD will be
    // shown on every visit. Requires support for localStorage.
    // Updating only the MOTD title (and not the text) will not make the MOTD
    // appear again.
    const motdShowOnlyOnce = true

    // What pages should the MOTD be shown on? By default, homepage and mobile
    // pages.
    const motdShowOnPages = [
        '/',
        '/mobile'
    ]

    // Clustering! Different zoom levels for desktop vs mobile.
    const disableClusters = false // Default: false
    const maxClusterZoomLevel = 12 // Default: 14
    const maxClusterZoomLevelMobile = 12 // Default: same as desktop
    const clusterZoomOnClick = false // Default: false
    const clusterZoomOnClickMobile = false // Default: same as desktop
    const clusterGridSize = 90 // Default: 60
    const clusterGridSizeMobile = 60 // Default: same as desktop

    // Process Pokémon in chunks to improve responsiveness.
    const processPokemonChunkSize = 250 // Default: 100
    const processPokemonChunkSizeMobile = 150 // Default: 100
    const processPokemonIntervalMs = 50 // Default: 100ms
    const processPokemonIntervalMsMobile = 100 // Default: 100ms


    /* Feature detection. */

    const hasStorage = (function () {
        var mod = 'RocketMap'
        try {
            localStorage.setItem(mod, mod)
            localStorage.removeItem(mod)
            return true
        } catch (exception) {
            return false
        }
    }())


    /* Do stuff. */

    const currentPage = window.location.pathname


    // Set custom Store values.
    Store.set('maxClusterZoomLevel', maxClusterZoomLevel)
    Store.set('clusterZoomOnClick', clusterZoomOnClick)
    Store.set('clusterGridSize', clusterGridSize)
    Store.set('processPokemonChunkSize', processPokemonChunkSize)
    Store.set('processPokemonIntervalMs', processPokemonIntervalMs)
    Store.set('scaleByRarity', scaleByRarity)
    Store.set('upscalePokemon', upscalePokemon)
    Store.set('upscaledPokemon', upscaledPokemon)

    if (typeof window.orientation !== "undefined" || isMobileDevice()) {
        Store.set('maxClusterZoomLevel', maxClusterZoomLevelMobile)
        Store.set('clusterZoomOnClick', clusterZoomOnClickMobile)
        Store.set('clusterGridSize', clusterGridSizeMobile)
    }

    if (disableClusters) {
        Store.set('maxClusterZoomLevel', -1)
    }

    // Google Analytics.
    if (analyticsKey.length > 0) {
        window.ga = window.ga || function () {
            (ga.q = ga.q || []).push(arguments)
        }
        ga.l = Date.now
        ga('create', analyticsKey, 'auto')
        ga('send', 'pageview')
    }

    // Show MOTD.
    if (motdEnabled && motdShowOnPages.indexOf(currentPage) !== -1) {
        let motdIsUpdated = true

        if (hasStorage) {
            const lastMOTD = window.localStorage.getItem('lastMOTD') || ''

            if (lastMOTD === motd) {
                motdIsUpdated = false
            }
        }

        if (motdIsUpdated || !motdShowOnlyOnce) {
            window.localStorage.setItem('lastMOTD', motd)

            swal({
                title: motdTitle,
                text: motd
            })
        }
    }
})
