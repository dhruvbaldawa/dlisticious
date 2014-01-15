function getCourses() {
    var COURSE_URL = 'https://www.coursera.org/maestro/api/topic/information?topic-id=';
    var courses_list = ['android', 'randomness', 'networksonline'];
    var courses = []
    var defs = []
    for(var i=0; i < courses_list.length; i++) {
        defs.push($.getJSON(COURSE_URL + courses_list[i]))
    }
    $.when.apply($, defs).done(function() {
        for(var i=0; i < arguments.length; i++) {
            courses.push(arguments[i][0]);
        }
        renderCourses(courses);
    });
}

function renderCourses(courses) {
    var source = $("#courses-template").html();
    var template = Handlebars.compile(source);
    $("#courses").html(template({'courses': courses}));
}

$(document).ready(function(){
    getCourses();
});
