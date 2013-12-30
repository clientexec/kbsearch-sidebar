var kbsearch = {};

$(document).ready(function(){


    $(document).on("keypress", "#kbsearchcontainer #kbquery", function(event){
        if ( event.which == 13 ) {
            event.preventDefault();
            clientexec.searchKB_start = 0;
            clientexec.searchKB_query = $('#kbquery').val();
            clientexec.searchKB();
        }
    });

    clientexec.searchKB = function() {
        
        $('#kbsearchcontainer #kbsearchresults').html("<img style='margin:20px;padding-left:50px;' class='kbsearchresult-icon-article' src='../images/loader.gif'>");
        var kbarticletemplate = "",prevDisabled="",nextDisabled="";
        $.ajax({
            url: "index.php?fuse=knowledgebase&action=getAutoSuggetArtices",
            dataType: 'json',
            data: {
                start:clientexec.searchKB_start,
                subject: clientexec.searchKB_query
                },
            success: function(json) {
                kbarticletemplate = "Results <span class='color:#888;'>("+json.total_entries+")</span> <div style='border-top:1px solid #ddd; width:175px;margin:5px 0px 0px 0px;'></div>";
                if (json.total_entries === 0) {
                    $('#kbsearchcontainer #kbsearchresults').html(kbarticletemplate+"No articles found").show();
                } else {
                    kbarticletemplate +="{{#entries}}<div class='kbsearchresult-article'><img class='kbsearchresult-icon-article' src='../templates/default/images/public/icon_article.png'><a title='{{excerpt}}' target='_blank' class='articleresult_access_{{access}}' onclick='clientexec.popupKBArticle({{id}},\"{{title}}\")'>{{title}}</a></div>{{/entries}}";
                    if (json.total_entries > 5) {
                        prevDisabled = (clientexec.searchKB_start===0) ? "disabled='disabled'": "";
                        nextDisabled = (clientexec.searchKB_start + 5 >= json.total_entries) ? "disabled='disabled'": "";
                        kbarticletemplate += "<div id='kbsearchresultsmore' class='richgrid-pagenavi'><span class='previouspostslink' "+prevDisabled+"></span><span class='nextpostslink' "+nextDisabled+"></span></div>";
                    } else {
                        kbarticletemplate += "<br/>";
                    }

                    $('#kbsearchcontainer #kbsearchresults').html(Mustache.render(kbarticletemplate, json)).show();

                }
                
                $('#kbquery').attr('value',clientexec.searchKB_query);
                var session_vars = {
                    KB_Searchquery: clientexec.searchKB_query,
                    KB_Searchstart: clientexec.searchKB_start,
                    KB_SearchResults: $('#kbsearchcontainer #kbsearchresults').html()
                };

                $.ajax({
                    url: 'index.php?fuse=clients&action=updatesessionvar',
                    type: 'POST',
                    data: { fields : session_vars }
                });

            }
        });
    };

    clientexec.bindSearchResultClicks = function() {

        $(document).on("click", "#kbsearchresultsmore .previouspostslink", function(event){
            if ($(this).attr('disabled')) {
                return false;
            }
            clientexec.searchKB_start = clientexec.searchKB_start-5;
            if (clientexec.searchKB_start < 0) clientexec.searchKB_start = 0;
            clientexec.searchKB();
        });

        $(document).on("click", "#kbsearchresultsmore .nextpostslink", function(event){
            if ($(this).attr('disabled')) {
                return false;
            }
            clientexec.searchKB_start = clientexec.searchKB_start+5;
            clientexec.searchKB();
        });
    };

    clientexec.bindSearchResultClicks();

});
