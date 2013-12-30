<?php
require_once 'modules/admin/models/DashboardPlugin.php';

class PluginKbsearch extends DashboardPlugin
{
    /* plugin member vars used by ClientExec */
    var $name = "Knowledgebase Search";
    var $smallName = "KB Search";

    var $description = "Search your KB articles to assist support staff with ticket resolution.";
    var $default = true; //to be included with fresh installs
    var $sidebarPlugin = true;
    var $cache = true;
    var $iconName  = "icon-book"; // must be bootstrap defined icon
    var $cssPages = array('plugins/dashboard/kbsearch/plugin.css');
    var $jsLibs  = array('plugins/dashboard/kbsearch/plugin.js');

    /*
    var $cssPages = array('plugins/dashboard/whoisonline/style.css');
    */

    //override the getPanel of DashboardPlugin as we do not want or have an index.phtml to output
    //we can just return html directly
    public function getPanel()
    {
        if (isset($this->session->KB_SearchResults)) {
            $this->view->cache_KBSearchResults = $this->session->KB_SearchResults;
            //we should also have start and query
            $this->view->cache_KBSearchstart = $this->session->KB_Searchstart;
            $this->view->cache_KBSearchquery = $this->session->KB_Searchquery;
        } else {
            $this->view->cache_KBSearchResults = "";
            $this->view->cache_KBSearchstart = 0;
            $this->view->cache_KBSearchquery = "";
        }

        return parent::getPanel();
    }

}
