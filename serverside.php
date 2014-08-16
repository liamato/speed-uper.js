<?php

$dev = false;

if(isset($_GET['dev'])){$dev = $_GET['dev'];}else if(isset($_POST['dev'])){$dev = $_POST['dev'];}
if(isset($_GET['opts'])){$opts = $_GET['opts'];}else if(isset($_POST['opts'])){$opts = $_POST['opts'];}

// PHP link checker

class link{

    private $link;
    public $meth;
    public $docFound;
    public $statusCode;
    public $curl;
    public $headers = [];
    public $content;

    public function __construct(){
        $this->chkHTTP();
        $this->stsCode();
        $this->chkURL();
        $this->validate();
        $this->content();
    }

    private function chkHTTP(){
        if(isset($_GET['url'])){
            $url = $_GET['url'];
            if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                $this->link = "http://" . $url;
            }else{
                $this->link = $_GET['url'];
            }
            $this->meth = 'GET';
        }else if(isset($_POST['url'])){
            $url = $_POST['url'];
            if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                $this->link = "http://" . $url;
            }else{
                $this->link = $_POST['url'];
            }
            $this->meth = 'POST';
        }

    }

    private function stsCode(){
        $this->Curl();
        $this->statusCode = $this->curl['http_code'];
    }

    private function validate(){
        $headers = @get_headers($this->link);

        //echo '<pre>', print_r($_GET),'</pre>';

        foreach($headers as $v){
            if(preg_match("#^HTTP/#", $v)){
                $http = explode(" ", $v, 2);
                if($dev){echo '<pre>', print_r($http), '</pre>';}
                $this->headers['httpVersion'] = $http[0];
                $this->headers['responseCode'] = $http[1];
                $http = [];
            }else{
                $http = explode(": " , $v, 2);
                if($dev){echo '<pre>', print_r($http), '</pre>';}       
                $this->headers[$http[0]] = $http[1];
                $http = [];
            }
        }
        $this->headers['Raw'] = implode("\n", $headers);
        if($dev){echo '<pre>', print_r($this->headers), '</pre>';}

        //return $this->headers;
    }

    private function chkURL(){
        $headers = @get_headers( $this->link);
        $headers = (is_array($headers)) ? implode( "\n ", $headers) : $headers;
        $this->docFound = ["found" => (bool)preg_match('#^HTTP/.*\s+[(200|301|302)]+\s#i', $headers)];
    }

    private function Curl(){

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->link);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch , CURLOPT_RETURNTRANSFER, 1);
        $data = curl_exec($ch);
        $headers = curl_getinfo($ch);
        curl_close($ch);

        $this->curl = $headers;
    }

    private function content(){
        $this->content = file_get_contents($this->link);
    }
}
if(!$dev){header('Content-Type: application/json');}
$link = new link();

if($opts != 'content'){
    
    $content = ["Headers" => $link->headers,"Document" => $link->docFound,"cURL" => $link->curl];
    if($dev){
        echo 'link->headers: </br>';
        echo '<pre>' ,print_r($link->headers), '</pre>';


        echo 'link->docFound: </br>';
        echo '<pre>' ,var_dump($link->docFound), '</pre>';


        echo 'link->curl: </br>';
        echo '<pre>' ,print_r($link->curl), '</pre>';


        echo '$content: </br><pre>', print_r($content), '</pre>';

        echo'json_encode($content): </br><pre>';
    }

    echo json_encode($content);

    if($dev){echo '</pre>';}
}else if($opts == 'content'){
    echo $link->content;
}
//echo json_encode($link->Curl());