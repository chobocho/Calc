/*
 * Simple Calculator
 *    
 * Version : 1.0
 * Update  : 2016. 4. 30
 *
 */

/*-----------------------------------------------*
 *  Global variables
 *-----------------------------------------------*/
var DEBUG_PRINT = false;  // Debug Mode Option
var TRACE_PRINT = true;  // Trace Mode Option
 
 
// Type of Token
var TOKEN_NONE      = 0;
var TOKEN_PLUS      = 1; // +
var TOKEN_MINUS     = 2; // -
var TOKEN_MULTI     = 3; // *
var TOKEN_VARIABLE  = 4; // @[a-zA-Z0-9]*
var TOKEN_NUMBER    = 5; // [0-9]+
var TOKEN_ASSIGN    = 6; //  =
var TOKEN_COMMENT   = 7; //  //
var TOKEN_LBRACE    = 8; //  {
var TOKEN_RBRACE    = 9; //  }

var TOKEN_DELIMITER = 10; 
var TOKEN_UNKNOWN   = 11;
var TOKEN_EOL       = 12; //  ; end of line
var TOKEN_LPAREN    = 13; //  (
var TOKEN_RPAREN    = 14; //  )
var TOKEN_DIVIDE    = 15; //  /
var TOKEN_MOD       = 16; //  %

var TOKEN_PRINT     = 17;
var TOKEN_EOE       = 18;

var TOKEN_EOL_KW     = ';';
var TOKEN_COMMENT_KW = '/';
var TOKEN_PLUS_KW    = '+';
var TOKEN_MINUS_KW   = '-';
var TOKEN_MULTI_KW   = '*';
var TOKEN_LBRACE_KW  = '{'; 
var TOKEN_RBRACE_KW  = '}';

// Type of Error
var SYNTAX            = 100;
var UNBALANCED_PARENS = 101;
var NOEXPRESSION      = 102;
var DIVIDE_BY_ZERO    = 103;
 

// Type of End
var EOE            = "\0"; 
var ErrorMessage   = "";
var IsOccuredError = false;

var source_code    = "";
var source_idx     = 0;
var gToken         = "";
var tokenType      = 0;
var stack;


/*-----------------------------------------------*
 *  Main Function
 *-----------------------------------------------*/
function main(args) {

    var Result = {};
        
    Result = Evaluate(args);

    if (IsOccuredError == true)
    {
        Result = ErrorMessage;
    }    
    return Result;
}

 
function Evaluate(args)
{
    var result = "";
    var tempValue = 0;
    source_idx = 0;
    source_code = args;
    stack = [];
    sumStack = [];
    isOpenedBrace = false;
    IsOccuredError = false;
    tokenType = TOKEN_NONE;
    gToken = TOKEN_NONE;
    var IsLineStart = true; 
    var operator = TOKEN_PLUS;
    var tempCh = "";
    
    while(tokenType != TOKEN_EOE) {

        // Get first TOKEN
        getToken();
        
        TRACE("1st token: " + tokenType);
        switch(tokenType) {                      
            case TOKEN_PLUS:
                 operator = TOKEN_PLUS;
                 break;
            case TOKEN_MINUS:
                 operator = TOKEN_MINUS;
                 break;
            case TOKEN_MULTI:
                 operator = TOKEN_MULTI;
                break;
            case TOKEN_VARIABLE:
                break;
            case TOKEN_NUMBER:
                 stack.push(gToken);
                 break;  
            case TOKEN_ASSIGN:
                break;     
            case TOKEN_COMMENT:
                break;
            case TOKEN_LBRACE:
                isOpenedBrace = true;
                sumStack.push('{');
                result += "{\n" 
                break;
            case TOKEN_RBRACE:
                tempValue = 0;
                while (sumStack.length > 0) {
                    tempCh = sumStack.pop();
                    if ( tempCh == '{') break;
                    else { 
                        tempValue += parseInt(tempCh);
                    }
                };

                result += "} " + tempValue + "\n";
 
                if (sumStack.length > 0 ) {
                    sumStack.push(tempValue);
                } else {
                  isOpenedBrace = false;
                }

                break;    
            case TOKEN_EOE:
                if (stack.length <= 0) break;
                /* fall through */
            case TOKEN_EOL:
                switch(operator) {
                    case TOKEN_PLUS:
                        tempValue = 0;
                        while (stack.length > 0) {
                            tempValue += parseInt(stack.pop());
                        };
                        break;
                    case TOKEN_MINUS:
                        tempValue = 0;
                        while (stack.length >= 2) {
                            tempValue += parseInt(stack.pop());
                        };
                        tempValue = parseInt(stack.pop()) - tempValue;
                        break;   
                    case TOKEN_MULTI:
                        tempValue = 1;
                        while (stack.length > 0) {
                            tempValue *= parseInt(stack.pop());
                        };
                        break;
                }
                result += tempValue + "\n";
                if ( isOpenedBrace ) {
                    sumStack.push(tempValue);
                }
                tempValue = 0;
                IsLineStart = true;
                operator = TOKEN_PLUS;
                break;   
            case TOKEN_UNKNOWN:
                TRACE("Err : Unknown Token");   
                break;                
            default:
                break;
        }

    };
    result += "\n- END -";
    return result;
}

function getToken()
{
    tokenType = TOKEN_NONE;
    gToken = "";
    
    
    if ( source_idx >= source_code.length ) 
    {
        tokenType = TOKEN_EOE;
        return;
    }   
     
    while (   ( source_idx < source_code.length ) && 
              ( source_code.charAt(source_idx) != '@') && 
              ( !isDigit( source_code.charAt(source_idx) ) )&&
              ( !isDelimiter( source_code.charAt(source_idx) ) )  
    ) 
    {
        ++source_idx;
    }            
        
    if ( source_idx >= source_code.length ) 
    {
        tokenType = TOKEN_EOE;
        return;
    }   

    if ( isDelimiter( source_code.charAt(source_idx) ) )
    {
        tokenType = TOKEN_DELIMITER;
    }
 
    else if ( isDigit ( source_code.charAt(source_idx) ) )
    {
        tokenType = TOKEN_NUMBER;
    }   
    
    
    switch(tokenType) {
        case TOKEN_DELIMITER:
        {
            switch(source_code.charAt(source_idx)) {
                case TOKEN_EOL_KW:
                    ++source_idx;
                    tokenType = TOKEN_EOL;
                    break;
                case TOKEN_COMMENT_KW:
                    ++source_idx;
                    tokenType = TOKEN_COMMENT;
                    break;
                case TOKEN_PLUS_KW:
                    ++source_idx;
                    tokenType = TOKEN_PLUS;
                    break;
                case TOKEN_MINUS_KW:
                    ++source_idx;
                    tokenType = TOKEN_MINUS;
                    break;
                case TOKEN_MULTI_KW:
                    ++source_idx;
                    tokenType = TOKEN_MULTI;  
                    break;  
                case TOKEN_LBRACE_KW:
                    ++source_idx;
                    tokenType = TOKEN_LBRACE;
                    break;
                case TOKEN_RBRACE_KW:
                    ++source_idx;
                    tokenType = TOKEN_RBRACE;
                    break;
                default:
                    ++source_idx;
                    tokenType = TOKEN_UNKNOWN;
                    break;   
            }
        }
            break;
        case TOKEN_VARIABLE:
            break;
        case TOKEN_NUMBER: 
        {
            while ( isDigit ( source_code.charAt(source_idx) ) )
            {
                gToken += source_code.charAt(source_idx);
                ++source_idx;
                if (source_idx >= source_code.length )
                    break;
            }
        }
            break;
        default:
            break;
    }
}

function isDelimiter ( ch )
{
    if ("+-/*=(){}@;".indexOf(ch) != -1)
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

