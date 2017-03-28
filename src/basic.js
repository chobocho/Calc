/*
 * Simple Calculator
 *    
 * Version : 1.0
 * Update  : 2017. 3. 29
 *
 */

 // 2016. 9. 2  : Add code to support simple lisp 
 // 2016. 9. 3  : Add code to support divide  
 // 2017. 3. 29 : Remove simple lisp code
/*-----------------------------------------------*
 *  Global variables
 *-----------------------------------------------*/
var DEBUG_PRINT = false;  // Debug Mode Option
var TRACE_PRINT = true;  // Trace Mode Option
 
 
// Type of Token
var TOKEN_NONE        = 0;
var TOKEN_PLUS        = 1; // +
var TOKEN_MINUS       = 2; // -
var TOKEN_MULTI       = 3; // *
var TOKEN_VARIABLE    = 4; // @[a-zA-Z0-9]*
var TOKEN_NUMBER      = 5; // [0-9]+
var TOKEN_ASSIGN      = 6; //  =
var TOKEN_COMMENT     = 7; //  //
var TOKEN_LBRACE      = 8; //  {
var TOKEN_RBRACE      = 9; //  }
                      
var TOKEN_DELIMITER   = 10; 
var TOKEN_UNKNOWN     = 11;
var TOKEN_EOL         = 12; //  ; end of line
var TOKEN_LPAREN      = 23; //  (
var TOKEN_RPAREN      = 24; //  )
var TOKEN_DIVIDE      = 15; //  /
var TOKEN_MOD         = 16; //  %
                      
var TOKEN_PRINT       = 17;
var TOKEN_EOE         = 18;
                      
var TOKEN_COMMENT_KW  = '#';
var TOKEN_EOL_KW      = ';';
var TOKEN_DEVIDE_KW   = '/';
var TOKEN_PLUS_KW     = '+';
var TOKEN_MINUS_KW    = '-';
var TOKEN_MULTI_KW    = '*';
var TOKEN_LBRACE_KW   = '{';
var TOKEN_RBRACE_KW   = '}';
var TOKEN_LPAREN_SZ   = '(';
var TOKEN_RPAREN_SZ   = ')';
var TOKEN_EQ          = '=';
var TOKEN_GT          = '>';
var TOKEN_GL          = '<';
var TOKEN_GE          = '>=';
var TOKEN_LE          = '<=';



// Type of Error
var SYNTAX            = 100;
var UNBALANCED_PARENS = 101;
var NOEXPRESSION      = 102;
var DIVIDE_BY_ZERO    = 103;
 

// Type of End
var EOE               = "\0"; 
var ErrorMessage      = "";
var IsOccuredError    = false;

var source_code       = "";
var source_idx        = 0;
var gToken            = "";
var tokenType         = 0;
var stack;
var dict              = [];            

/*-----------------------------------------------*
 *  Main Function
 *-----------------------------------------------*/
function main(args) {

    var Result = "";
     
    args = args.trim();
 
    if ( args.charAt(0) != '{' ) {
        args = '{' + args + '}';       
    }

    Result = Evaluate(args);
    
    if (IsOccuredError == true)
    {
        Result = ErrorMessage;
    } 
    return Result;
}

function onError(msg){
    IsOccuredError = true;
    ErrorMessage = msg;
    TRACE(msg);
}

/**
{
100*20-10+4/2
이자 9000000/18 + 10000-1000
통신비 30000
집세 900000
용돈 100000 + 5000*30
기부금 100000+20000+5000
이자 + 통신비 + 집세 + 용돈 + 기부금
}
*/
function Evaluate(args)
{
    var result = "";
    var tempValue = 0;
    var source_code =  args.replace(/{/g, '\n{\n').replace(/}/g, '\n}\n').split(/\n/g);
    stack = [];
    sumStack = [];
    isOpenedBrace = false;
    IsOccuredError = false;
    var IsLineStart = true; 
    var tempCh = "";

    // Parsing and insert Stack
    for (var i = 0; i < source_code.length; i++) {
        var line = source_code[i].trim();
        if (line == "") continue;
        TRACE(line);
        var exp = line.split(/\s+/g);
        TRACE (exp);
    }
    // Evaluate code 

    result += "\n- END -";
    return result;
}


function isDelimiter ( ch )
{
    if ("+-/*=(){};".indexOf(ch) != -1)
        return true;
    return false;
}


function isDigit ( ch )
{
    if ("0123456789".indexOf(ch) != -1)
        return true;
    return false;
}

function PrintError (str)
{
    if (DEBUG_PRINT == true)
    {
        console.log(str);
    }
    else 
    {
        tempStr = document.source_code.result_view.value;
        ErrorMessage = tempStr + "\n" + str;     
    }
    
    IsOccuredError = true;    
}

function TRACE (str)
{
    if (TRACE_PRINT == true)
    {
        console.log(str);    
    }    
}

