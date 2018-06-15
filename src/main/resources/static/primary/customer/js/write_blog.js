/**
 * Created by Administrator on 2017-1-10.
 */
define(['jquery', 'summernote'], function ($, summernote) {
    $(function () {
        $('#summernote').summernote({
            height: 800,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            focus: true                  // set focus to editable area after initializing summernote
        });

        $("#submit_blog_content").click(function () {
            var route_name = $("#route_name").val();
            var title = $("#title").val();
            var content = $('#summernote').summernote('code');
            var data = {
                "route_name" : route_name,
                "title" : title,
                "content" : content,
                'csrfmiddlewaretoken' : '{{ csrf_token }}'
            };
            $.post("{% url 'save_blog' %}", data);
        });
    });

});