<?php

/*
Plugin Name: Bi Cf7 Calendar
Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
Description: A brief description of the Plugin.
Version: 1.0
Author: Strauss Bornman
Author URI: http://URI_Of_The_Plugin_Author
License: A "Slug" license name e.g. GPL2
*/

function settings_page($data){
    echo 'hello';
};


//add_submenu_page("menu-settings","Calendar Settings", "Calendar", "manage_options", "bi-calendar", 'settings_settings_page');



add_action('admin_menu', 'bi_register_admin_console');

function bi_register_admin_console() {
    add_submenu_page( 'wpcf7',"Calendar Settings", "Calendar", "manage_options", "bi-calendar", 'settings_page');
    add_menu_page("Calendar Settings", "Calendar", "manage_options", "bi-calendar", 'settings_page','',81);
}




function cal_func($atts = []) {
    $url = plugin_dir_url(  __FILE__ );

    wp_enqueue_script( 'bi-cal', $url  . 'assets/js/calendar.js', null, 1.0, true);
    wp_enqueue_style( 'calendar', $url . 'assets/css/calendar.css',false,'1.0','all');
    $a = shortcode_atts( [
        'id' => 'bi-cal',
        'name' => 'calendar',
        'class' => '',
        "popup"=>true,
        'type' => 'single', //Single : Multiple : Range
        'prefix' => 'bi-',
        'cssJoin' => '-',
        "dateJoin"=>"-",
        "dateSeperator"=>";",
        'date'=>'',
        'shortMonth'=>false,
        'target'=>'self',
        'selected'=>'',
        "yearClass"=>"",
        "monthClass"=>"",
        "dayClass"=>"",
        "minDate"=>'',
        "maxDate"=>''
    ], $atts );

    $class = is_array($a['class'])?implode(' ',$a['class']):$a['class'];
    $type = '';
    switch ($a['type']){
        case 'range':
            $type = "range='true'";
            break;
        case 'multiple':
            $type = "multiple='true'";
            break;
    }


    $maxDate = (isset($a['maxDate']) AND strtolower($a['maxDate']) !== '')?"maxDate='${a['maxDate']}'":'';
    $minDate = (isset($a['minDate']) AND strtolower($a['minDate']) !== '')?"minDate='${a['minDate']}'":'';

    return "<input type='input' ${type} name='${a['name']}' id='${a['id']}' class='bi-calendar ${class}' ${minDate} ${maxDate}/>";

}
add_shortcode( 'bi-calendar', 'cal_func' );