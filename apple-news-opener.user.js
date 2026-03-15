// ==UserScript==
// @name         Open in Apple News+
// @namespace    https://moiselacy.com
// @version      3.1.0
// @description  Detects Apple News+ publications and shows a floating button to open the specific article in Apple News
// @author       Moïse Lacy
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ─── Domain → Apple News publication mapping ───────────────────────────
  const PUBLICATIONS = {
    'theatlantic.com':        { name: 'The Atlantic',              channelId: 'ToeaQ_L_NQPCFBus3ZQ7O4A' },
    'wsj.com':                { name: 'The Wall Street Journal',   channelId: 'TLZKrjVHNQX6EU84bXaUU4w' },
    'washingtonpost.com':     { name: 'The Washington Post',       channelId: 'TWnoJEyylRkqOFV6TfyhUnA' },
    'newyorker.com':          { name: 'The New Yorker',            channelId: 'TpSq6-TTXRq2-MJYZrB50zg' },
    'vanityfair.com':         { name: 'Vanity Fair',               channelId: 'TRPHZZYvIQgi7b7huuygTQg' },
    'wired.com':              { name: 'WIRED',                     channelId: 'TvhDsCM02Sz2u5ut0wrZFwA' },
    'time.com':               { name: 'TIME',                      channelId: 'Tre9uuzUIT7KcM-bDssUGFA' },
    'people.com':             { name: 'People',                    channelId: 'TOY6tFYZ3TaimEPs7wGC2Dw' },
    'bonappetit.com':         { name: 'Bon Appétit',               channelId: 'TvYqYnE9ERv2ZPv9pthI3Ew' },
    'nationalgeographic.com': { name: 'National Geographic',       channelId: 'TYBN0JfZEQi-5MgQhYroZ-w' },
    'nymag.com':              { name: 'New York Magazine',         channelId: 'TiA1BeSRfPYOGauvlm-NXBQ' },
    'thecut.com':             { name: 'New York Magazine',         channelId: 'TiA1BeSRfPYOGauvlm-NXBQ' },
    'vulture.com':            { name: 'New York Magazine',         channelId: 'TiA1BeSRfPYOGauvlm-NXBQ' },
    'grubstreet.com':         { name: 'New York Magazine',         channelId: 'TiA1BeSRfPYOGauvlm-NXBQ' },
    'curbed.com':             { name: 'New York Magazine',         channelId: 'TiA1BeSRfPYOGauvlm-NXBQ' },
    'slate.com':              { name: 'Slate',                     channelId: 'Tvehpk8o-QR6NyxGYANB9PA' },
    'theathletic.com':        { name: 'The Athletic',              channelId: 'TGZrXYjEmTdOtVrhVEViDCA' },
    'oprahdaily.com':         { name: 'Oprah Daily',               channelId: 'TdgxCv4fZQbibbveNS2s4EQ' },
    'latimes.com':            { name: 'Los Angeles Times',         channelId: 'TZB80-QdjS1mg1tsY9B7XyQ' },
    'sfchronicle.com':        { name: 'San Francisco Chronicle',   channelId: 'TzWk0onohSImD9To0RdSnCg' },
    'houstonchronicle.com':   { name: 'Houston Chronicle',         channelId: 'T90JTL6_fSseAtRr52ahBhw' },
    'expressnews.com':        { name: 'San Antonio Express-News',  channelId: 'Tu9LUdJQOTt6k5NDZVQ-IUg' },
    'dallasnews.com':         { name: 'The Dallas Morning News',   channelId: 'Ti7Xj3DMJSH-MFw4kxph0lw' },
    'ajc.com':                { name: 'The Atlanta Journal-Constitution', channelId: 'Tw0EcAFdKTEC8TbU_Kh3fPg' },
    'inquirer.com':           { name: 'Philadelphia Inquirer',     channelId: 'T0vYqMwKkRmOj_mMkvvAAjA' },
    'freep.com':              { name: 'Detroit Free Press',        channelId: 'T28TLWnufQzCSz0NXDfnKCA' },
    'detroitnews.com':        { name: 'The Detroit News',          channelId: 'TlQoM4E4KRHiqfZwTeGNiTw' },
    'startribune.com':        { name: 'The Minnesota Star Tribune', channelId: 'Tc4RzaL_WRHC6PiaX8qsqgg' },
    'miamiherald.com':        { name: 'Miami Herald',              channelId: 'TrnrWWmUtRcyoEIB0P1AtTw' },
    'sacbee.com':             { name: 'The Sacramento Bee',        channelId: 'TqvMN44iLSiaVhkE041LQ2Q' },
    'kansascity.com':         { name: 'The Kansas City Star',      channelId: 'TAwokJIyGSl2MPVziXvFzMg' },
    'charlotteobserver.com':  { name: 'The Charlotte Observer',    channelId: 'TW_VziKveSo2Anyew7bdpZw' },
    'tampabay.com':           { name: 'Tampa Bay Times',           channelId: 'TjqCDVkw7QAyduAvoFKf7KA' },
    'jsonline.com':           { name: 'Milwaukee Journal Sentinel', channelId: 'TabMw29PtTp-HaSLs0lNFVg' },
    'indystar.com':           { name: 'The Indianapolis Star',     channelId: 'TOQJ_oLOgRq-wwLTs1lHncg' },
    'cincinnati.com':         { name: 'Cincinnati Enquirer',       channelId: 'TYRyR4ndeTlOCCS6_KazulQ' },
    'oklahoman.com':          { name: 'The Oklahoman',             channelId: 'T537nVb1QSlWdf9wvuxoJrQ' },
    'desmoinesregister.com':  { name: 'The Des Moines Register',   channelId: 'T1vGrwOL8SeeJWmqO_vEFyA' },
    'providencejournal.com':  { name: 'The Providence Journal',    channelId: 'T1PE90_pHRhyao6rQgyCrow' },
    'sltrib.com':             { name: 'The Salt Lake Tribune',     channelId: 'TGr6GYCVaQ0iHxCz2WNeCyw' },
    'fresnobee.com':          { name: 'Fresno Bee',                channelId: 'T5Yr6XW-jTRiqr8cJLPtwCg' },
    'star-telegram.com':      { name: 'Fort Worth Star-Telegram',  channelId: 'T0yiX1yZETiWC7BoC8zo1Cw' },
    'newsobserver.com':       { name: 'Raleigh News & Observer',   channelId: 'THjgds0l3Rwe-gYKpUqSKPg' },
    'idahostatesman.com':     { name: 'Idaho Statesman',           channelId: 'TLYuR25BoSESzfE2J-CkpJA' },
    'courier-journal.com':    { name: 'The Courier-Journal',       channelId: 'T7Iw8nFkwSK2804zyNxaDNA' },
    'commercialappeal.com':   { name: 'The Commercial Appeal',     channelId: 'TZxNyZW98SAG1Pq3qpI5M3g' },
    'palmbeachpost.com':      { name: 'The Palm Beach Post',       channelId: 'TfjlMa8L7T5SP8OZFrLpQ5A' },
    'pressherald.com':        { name: 'Portland Press Herald',     channelId: 'T0FLZYAAQQV-UsbINqiCRew' },
    'dispatch.com':           { name: 'The Columbus Dispatch',     channelId: 'TP6YuNQ35RjKn1H0zB4QJeA' },
    'tennessean.com':         { name: 'The Tennessean',            channelId: 'TyL63fcBxSv-fLrndU67jWQ' },
    'azcentral.com':          { name: 'azcentral',                 channelId: 'TFXXAYGeZQKmnkUORhne_eQ' },
    'statesman.com':          { name: 'Austin American-Statesman', channelId: 'TPxyU2-cmRjiOxk2Untr7RA' },
    'knoxnews.com':           { name: 'Knoxville News Sentinel',   channelId: 'TFh5tT6vxRtmH8QfwVxuDww' },
    'tallahassee.com':        { name: 'Tallahassee Democrat',      channelId: 'TvgVkC45vTA2wMuVh09aG0g' },
    'elpasotimes.com':        { name: 'El Paso Times',             channelId: 'TwH5K4CYXQD6Bf-oY-nnU4g' },
    'nj.com':                 { name: 'NJ.com',                    channelId: 'TBHxgsmkfRemcn8-bOpZCMA' },
    'cleveland.com':          { name: 'cleveland.com',             channelId: 'T1I3tJYsyTPq40WEFKYChUQ' },
    'lehighvalleylive.com':   { name: 'lehighvalleylive.com',     channelId: 'TIRSQaHOoRJ2uTQ7DQi6mzA' },
    'masslive.com':           { name: 'MassLive.com',              channelId: 'TQ3q4AwLwSwW97mXX9fpnaQ' },
    'mlive.com':              { name: 'MLive.com',                 channelId: 'TiXB8uvzNQRmHipk07OxWVg' },
    'oregonlive.com':         { name: 'OregonLive.com',            channelId: 'TychtSTm-Rdu5_7PHxdp90g' },
    'pennlive.com':           { name: 'PennLive.com',              channelId: 'TbecuxKjSQni3vaZRTqIzlA' },
    'silive.com':             { name: 'SILive.com',                channelId: 'Td7PxXGjfQKGCdGyliVxekg' },
    'syracuse.com':           { name: 'Syracuse.com',              channelId: 'T2cfa9g63Si6arUN2KkHKRQ' },
    'al.com':                 { name: 'AL.com',                    channelId: 'TA8jZe81WR-ewr49yt26VCQ' },
    'boston.com':              { name: 'Boston.com',                channelId: 'TK3baxLI3QCeChrMHF7UAaQ' },
    'ctinsider.com':          { name: 'CT Insider',                channelId: 'TtLWJD1pdROWL42X7Xs-VJQ' },
    'telegraph.co.uk':        { name: 'The Telegraph',             channelId: 'TBI4PO6BMQEOHrY6yj85PJQ' },
    'thetimes.com':           { name: 'The Times',                 channelId: 'TDeEFCni8Qf2zde3hjCsw-Q' },
    'thetimes.co.uk':         { name: 'The Times',                 channelId: 'TDeEFCni8Qf2zde3hjCsw-Q' },
    'haaretz.com':            { name: 'Haaretz',                   channelId: 'THB6szJX8Tb6jHwhfP7PC1Q' },
    'lemonde.fr':             { name: 'Le Monde',                  channelId: 'TJqI6kAXvQbC_r1m31wUPJQ' },
    'theaustralian.com.au':   { name: 'The Australian',            channelId: 'TgFxs8am8R_uHkx4iqj4lTw' },
    'theglobeandmail.com':    { name: 'The Globe and Mail',        channelId: 'T8DrF3Bh5SHCSfJ2qlK1scA' },
    'thestar.com':            { name: 'Toronto Star',              channelId: 'TTiTSd5oTQ9qMujWUJFZIZg' },
    'calgaryherald.com':      { name: 'Calgary Herald',            channelId: 'T3cflzvWrQZWcEtNS9i-HFw' },
    'edmontonjournal.com':    { name: 'Edmonton Journal',          channelId: 'TNq6O4fqoTcWxZHRLCfqNNw' },
    'montrealgazette.com':    { name: 'Montreal Gazette',          channelId: 'TyrdP_gd5Q5OW_L9GaUbgRg' },
    'ottawacitizen.com':      { name: 'Ottawa Citizen',            channelId: 'TRXzQgOPKTM2G9o-Cn95SPQ' },
    'vancouversun.com':       { name: 'Vancouver Sun',             channelId: 'T5PFd7f8xT02LRrupJWLbQQ' },
    'winnipegfreepress.com':  { name: 'Winnipeg Free Press',       channelId: 'TG7SUFxpHRZ6wsOIKG--c3A' },
    'financialpost.com':      { name: 'Financial Post',            channelId: 'TEpn8K9qrTluxUx_gxq43dA' },
    'vox.com':                { name: 'Vox',                       channelId: 'T3bPECRx6Sh2eroimgcrcvg' },
    'nationalreview.com':     { name: 'National Review',           channelId: 'TtYnXu1XkRKKajAcg0g_ezw' },
    'motherjones.com':        { name: 'Mother Jones',              channelId: 'Th8chJDqRSFS7A3ONXvJHSA' },
    'newsweek.com':           { name: 'Newsweek',                  channelId: 'TjaVeduJsQWeShssZ9Fxn4w' },
    'newrepublic.com':        { name: 'The New Republic',          channelId: 'TQcDeYcpDSrSc-M6nX3mR7w' },
    'thedailybeast.com':      { name: 'The Daily Beast',           channelId: 'TEsSMtXU9QpalgvK2VAsOPg' },
    'thedispatch.com':        { name: 'The Dispatch',              channelId: 'Tt9LBliA1QpaWhuexv2sK1w' },
    'foreignpolicy.com':      { name: 'Foreign Policy',            channelId: 'Tri0xRTLxTiqJxJhq5Tr8DQ' },
    'puck.news':              { name: 'Puck',                      channelId: 'TYUKWUK5SQOWuBYTvuJkDGA' },
    'bloomberg.com':          { name: 'Bloomberg Businessweek',    channelId: 'TVgiaC0hzRVuradhgG5IrNQ' },
    'fortune.com':            { name: 'FORTUNE',                   channelId: 'Tyt8H348rT9CE2EMXN7uwiA' },
    'entrepreneur.com':       { name: 'Entrepreneur',              channelId: 'TDawOgXq-QZmJM_lg3jwApg' },
    'businessinsider.com':    { name: 'Business Insider',          channelId: 'TwXlMRfx_RZiVCEpg9DNieA' },
    'forbes.com':             { name: 'Forbes',                    channelId: 'TAHxDJi2TTmSXaqCov1Tt6A' },
    'adweek.com':             { name: 'ADWEEK',                    channelId: 'TA7MWy0lVQCujxHnX5KE5qQ' },
    'fastcompany.com':        { name: 'Fast Company',              channelId: 'TRDkR9QPbS0yoKyV5iQSW5g' },
    'inc.com':                { name: 'Inc.',                      channelId: 'TgpculELoRG6kU30aUngQFw' },
    'barrons.com':            { name: "Barron's",                  channelId: 'TXb9oJQ8ATkOZe5DY60fW2w' },
    'marketwatch.com':        { name: 'MarketWatch',               channelId: 'TsQwOK2nXS7aA9vyJ0oEllw' },
    'investopedia.com':       { name: 'Investopedia',              channelId: 'TpB3o1SRUSem07JEr6R6itA' },
    'kiplinger.com':          { name: 'Kiplinger',                 channelId: 'TbIQ52ItdQlmFhrwMGw1B3w' },
    'ew.com':                 { name: 'Entertainment Weekly',      channelId: 'T-ThTWpvHTG22ISif3Yz9aw' },
    'rollingstone.com':       { name: 'Rolling Stone',             channelId: 'Ttaz1l9PmSt6tSP8fqO3KgA' },
    'hollywoodreporter.com':  { name: 'The Hollywood Reporter',    channelId: 'TBofB4uiTS3KdIa6B6r83kA' },
    'billboard.com':          { name: 'Billboard',                 channelId: 'TdDmiBwTnRXep7QF6wisuVQ' },
    'variety.com':            { name: 'Variety',                   channelId: 'TLJKUUdWlTEOjjXbJnMrdqA' },
    'runnersworld.com':       { name: "Runner's World",            channelId: 'Ta_8NuXV-RrOmCa1qwTN5xQ' },
    'bicycling.com':          { name: 'Bicycling',                 channelId: 'TsMpkFM2ySnKZKGaS87v3Pg' },
    'golfdigest.com':         { name: 'Golf Digest',               channelId: 'T02GvUTWrQhK0EO4S2rsaqQ' },
    'golf.com':               { name: 'Golf.com',                  channelId: 'TSV6XlimmQL6HrF3As6bf_A' },
    'si.com':                 { name: 'Sports Illustrated',        channelId: 'ToZ2AZ2jHQsW1LuMJYWrzvA' },
    'defector.com':           { name: 'Defector',                  channelId: 'TvA72n11fRbKgrpTKhfNeUQ' },
    'vogue.com':              { name: 'Vogue',                     channelId: 'THPmSrSBBTaWifTWsZ9j00A' },
    'elle.com':               { name: 'ELLE',                      channelId: 'TtbR5BO53RomTaCAoGN-xuQ' },
    'instyle.com':            { name: 'InStyle',                   channelId: 'Tf5kQNSgZS0mCzYOG9zyPGw' },
    'harpersbazaar.com':      { name: "Harper's Bazaar",           channelId: 'Tz-orowI0Ty-hJ-I5BiErgQ' },
    'essence.com':            { name: 'ESSENCE',                   channelId: 'TRZH0tJpAQ_ucJLEnRoPv1Q' },
    'wwd.com':                { name: 'WWD',                       channelId: 'TyWlmb4JKSGqbzlWMtNgNKw' },
    'foodandwine.com':        { name: 'FOOD & WINE',               channelId: 'TbkfxbmE8RCuUJfianJ5Mmg' },
    'eatingwell.com':         { name: 'EatingWell',                channelId: 'TAKAFxfesQ9WktMwss1jLGA' },
    'allrecipes.com':         { name: 'Allrecipes',                channelId: 'TpAJalqqrS6mLiD51Jvz1Xw' },
    'tasteofhome.com':        { name: 'Taste of Home',             channelId: 'TYTpptYW5SKeNMwVBR40C7Q' },
    'delish.com':             { name: 'Delish',                    channelId: 'TnnjK746SQZm094eZG30i6Q' },
    'cooksillustrated.com':   { name: "Cook's Illustrated",        channelId: 'TW0DgENkMRpKb-OLN44db0A' },
    'seriouseats.com':        { name: 'Serious Eats',              channelId: 'T2Xy7RUHzQgiIub7ErzEO-g' },
    'simplyrecipes.com':      { name: 'Simply Recipes',            channelId: 'TwRzjni1JTli2GrmmgwzDPw' },
    'epicurious.com':         { name: 'Epicurious',                channelId: 'TC8K0AcLsTpqYONEFiy0cBg' },
    'travelandleisure.com':   { name: 'Travel + Leisure',          channelId: 'T53EkVgARRIiK5g17be6ZGw' },
    'cntraveler.com':         { name: 'Condé Nast Traveler',       channelId: 'TP_ozH2ehSSyUjEtB3INMiw' },
    'texasmonthly.com':       { name: 'Texas Monthly',             channelId: 'TGvCTC2BFSBiQIxvuYKg6wQ' },
    'southernliving.com':     { name: 'Southern Living',           channelId: 'T5YKpKnjAQYe3pictbS2RZw' },
    'afar.com':               { name: 'AFAR',                      channelId: 'TKuiXpgomTv6oYTLaC-J00w' },
    'scientificamerican.com': { name: 'Scientific American',       channelId: 'TveHp0EHGTXenwIFMSprU9g' },
    'popularmechanics.com':   { name: 'Popular Mechanics',         channelId: 'TLg7ITl2UQq6YeoXAXbf3EA' },
    'smithsonianmag.com':     { name: 'Smithsonian Magazine',      channelId: 'T44WVkYXPSc-5V8ZGH28_PA' },
    'newscientist.com':       { name: 'New Scientist',             channelId: 'T1igTlZ8xTAiyMs8q1JtDbw' },
    'architecturaldigest.com':{ name: 'Architectural Digest',      channelId: 'TOAhfE5Z9S-2vIJq-mQxaeA' },
    'bhg.com':                { name: 'Better Homes & Gardens',    channelId: 'TDd1_4SgdQeWJ0fnHDzQJNA' },
    'realsimple.com':         { name: 'Real Simple',               channelId: 'Tyl2VHgT9QcW_nL0c9ZEZQA' },
    'elledecor.com':          { name: 'ELLE DECOR',                channelId: 'Tmup0WoQiQ_yKSd3ds5l3Ag' },
    'goodhousekeeping.com':   { name: 'Good Housekeeping',         channelId: 'T_1ghGZc1TymTMyUvcpO0Xw' },
    'housebeautiful.com':     { name: 'House Beautiful',           channelId: 'TH_bGW9BaQASfv7hRxVqX-A' },
    'dwell.com':              { name: 'Dwell',                     channelId: 'T_lVyb4HOThCkz9sJREUK3Q' },
    'consumerreports.org':    { name: 'Consumer Reports',          channelId: 'TM1mcp8rbT8WCPq2WtDE07A' },
    'thefamilyhandyman.com':  { name: 'The Family Handyman',       channelId: 'TcDYLvXXDQvCPOcnLbuvxjg' },
    'thespruce.com':          { name: 'The Spruce',                channelId: 'TMZkUXSr0RKWNSjt4dek40Q' },
    'caranddriver.com':       { name: 'Car and Driver',            channelId: 'TTFHRZCR3Myu5lJNRDdaYEw' },
    'roadandtrack.com':       { name: 'Road & Track',              channelId: 'TrverXLepSqahYmQsVG_upg' },
    'motortrend.com':         { name: 'MOTORTREND',                channelId: 'TPLckrXk3Q6idqkBoWJbS5g' },
    'gq.com':                 { name: 'GQ',                        channelId: 'TmuBDRiM7RF-EZibXCKFuwQ' },
    'esquire.com':            { name: 'Esquire',                   channelId: 'Ta9qK14IvRGGrHIHqzOduqg' },
    'menshealth.com':         { name: "Men's Health",              channelId: 'T5bQojb2nRVOdpFwlXrq75A' },
    'womenshealthmag.com':    { name: "Women's Health",            channelId: 'T7dxJGUAnPku7e-lsUS8mhA' },
    'cosmopolitan.com':       { name: 'Cosmopolitan',              channelId: 'T799XmhnAQVu91-57ydf5Ng' },
    'townandcountrymag.com':  { name: 'Town & Country',            channelId: 'TlMZErDXrTdm8K1EpWbZSZw' },
    'prevention.com':         { name: 'Prevention',                channelId: 'TVciJTzjxT8S7qca103-SiQ' },
    'health.com':             { name: 'Health',                    channelId: 'TokmjZALNS3G7QUHvNnt3BA' },
    'shape.com':              { name: 'Shape',                     channelId: 'TeVtIZkiiScSpO6aozcfeVg' },
    'rd.com':                 { name: "Reader's Digest",           channelId: 'TEORVk9ehQMK6L73e2pfO6Q' },
    'aarp.org':               { name: 'AARP The Magazine',         channelId: 'TuLnZl32_QdS3BU9--4ht-g' },
    'parents.com':            { name: 'Parents',                   channelId: 'TUCnruND-Sum1v4zvH_ivEg' },
    'outside.com':            { name: 'Outside',                   channelId: 'T2BJuTjFiS8ia4hwt_sIVMg' },
    'robbreport.com':         { name: 'Robb Report',               channelId: 'TLcIvYZMyR8iJIggYmAi8Xw' },
    'pcgamer.com':            { name: 'PC Gamer',                  channelId: 'TCvPO_kF1S_CW1492lY1zzw' },
    'verywell.com':           { name: 'Verywell',                  channelId: 'TCRUppS4WTDSu8yxgrt2E6Q' },
    'verywellhealth.com':     { name: 'Verywell',                  channelId: 'TCRUppS4WTDSu8yxgrt2E6Q' },
    'verywellmind.com':       { name: 'Verywell',                  channelId: 'TCRUppS4WTDSu8yxgrt2E6Q' },
    'verywellfit.com':        { name: 'Verywell',                  channelId: 'TCRUppS4WTDSu8yxgrt2E6Q' },
    'lifewire.com':           { name: 'Lifewire',                  channelId: 'TNtS7rf6vTkCOr32cSwytLQ' },
    'sportico.com':           { name: 'Sportico',                  channelId: 'TxdXHyhmxQZySoSBhMMt0eg' },
  };

  // ─── Match the current hostname ────────────────────────────────────────
  function getMatchingPublication() {
    const hostname = window.location.hostname.replace(/^www\./, '');
    if (PUBLICATIONS[hostname]) return PUBLICATIONS[hostname];
    const parts = hostname.split('.');
    if (parts.length > 2) {
      const parent = parts.slice(1).join('.');
      if (PUBLICATIONS[parent]) return PUBLICATIONS[parent];
    }
    return null;
  }

  // ─── Check if this looks like an article page ──────────────────────────
  function isArticlePage() {
    const path = window.location.pathname;
    if (path === '/' || path === '') return false;
    const skipPatterns = [
      /^\/(account|login|signup|subscribe|register|settings|search|about|contact|privacy|terms|help|faq)/i,
      /^\/(section|category|tag|author|topic)s?\//i,
      /^\/[\w-]+\/?$/,
    ];
    for (const pattern of skipPatterns) {
      if (pattern.test(path)) return false;
    }
    const hasArticleTag = !!document.querySelector('article, [itemtype*="Article"], [data-type="article"]');
    const hasLongPath = path.split('/').filter(Boolean).length >= 2;
    const hasOGArticle = !!document.querySelector('meta[property="og:type"][content="article"]');
    return hasArticleTag || hasLongPath || hasOGArticle;
  }

  // ─── Build the floating button ─────────────────────────────────────────
  function createButton(publication) {
    const container = document.createElement('div');
    container.id = 'apple-news-opener';

    const iconSVG = `<svg width="22" height="22" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
      <rect width="32" height="32" rx="7" fill="#FA2D48"/>
      <path d="M10.5 8h2.8l5 9.2V8h2.5v16h-2.5l-5.3-9.7V24h-2.5V8z" fill="#fff"/>
    </svg>`;

    container.innerHTML = `
      <style>
        #apple-news-opener {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2147483647;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
          animation: an-slide-in 0.35s ease-out;
        }
        #apple-news-opener .an-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px 10px 12px;
          background: #1a1a1a; color: #fff;
          border: none; border-radius: 50px; cursor: pointer;
          font-size: 13px; font-weight: 600;
          letter-spacing: -0.01em; line-height: 1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08) inset;
          transition: all 0.2s ease;
          text-decoration: none; white-space: nowrap;
          -webkit-font-smoothing: antialiased;
        }
        #apple-news-opener .an-btn:hover {
          background: #2a2a2a; transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.12) inset;
        }
        #apple-news-opener .an-btn:active { transform: translateY(0); background: #222; }
        #apple-news-opener .an-label { display: flex; flex-direction: column; gap: 1px; }
        #apple-news-opener .an-title { font-size: 13px; font-weight: 600; }
        #apple-news-opener .an-sub { font-size: 10px; font-weight: 400; opacity: 0.55; }
        #apple-news-opener .an-close {
          position: absolute; top: -6px; right: -6px;
          width: 20px; height: 20px;
          background: #444; color: #fff;
          border: 2px solid #1a1a1a; border-radius: 50%;
          font-size: 11px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; opacity: 0; transition: opacity 0.15s ease;
        }
        #apple-news-opener:hover .an-close { opacity: 1; }
        #apple-news-opener .an-close:hover { background: #FA2D48; }
        @keyframes an-slide-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          #apple-news-opener { animation: none; }
          #apple-news-opener .an-btn { transition: none; }
        }
        @media (prefers-color-scheme: light) {
          #apple-news-opener .an-btn {
            background: #fff; color: #1a1a1a;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
          }
          #apple-news-opener .an-btn:hover {
            background: #f5f5f5;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08);
          }
          #apple-news-opener .an-close { background: #ccc; color: #333; border-color: #fff; }
        }
      </style>
      <div style="position:relative; display:inline-block">
        <button class="an-btn" title="Open this article in Apple News">
          ${iconSVG}
          <span class="an-label">
            <span class="an-title">Open in Apple News</span>
            <span class="an-sub">${publication.name}</span>
          </span>
        </button>
        <button class="an-close" title="Dismiss">\u2715</button>
      </div>
    `;

    // Click → invoke macOS Shortcut to open current URL in Apple News
    // Uses a hidden iframe to trigger the shortcuts:// URL scheme, which
    // bypasses Chromium's repeated "wants to open Shortcuts" confirmation dialog.
    container.querySelector('.an-btn').addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);
      const schemeUrl = `shortcuts://run-shortcut?name=Open%20in%20Apple%20News&input=text&text=${url}`;
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = schemeUrl;
      document.body.appendChild(iframe);
      setTimeout(() => iframe.remove(), 1000);
    });

    // Dismiss
    container.querySelector('.an-close').addEventListener('click', (e) => {
      e.stopPropagation();
      container.style.animation = 'none';
      container.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      container.style.opacity = '0';
      container.style.transform = 'translateY(8px)';
      setTimeout(() => container.remove(), 200);
      try { sessionStorage.setItem('an-opener-dismissed', '1'); } catch {}
    });

    return container;
  }

  // ─── Main ──────────────────────────────────────────────────────────────
  function init() {
    try { if (sessionStorage.getItem('an-opener-dismissed') === '1') return; } catch {}

    const pub = getMatchingPublication();
    if (!pub) return;
    if (!isArticlePage()) return;
    if (document.getElementById('apple-news-opener')) return;

    document.body.appendChild(createButton(pub));
  }

  // Delay to let page metadata settle
  setTimeout(init, 1000);
})();