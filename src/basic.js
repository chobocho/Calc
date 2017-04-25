/*
 * Simple Calculator
 *    
 * Version : 1.0
 * Update  : 2017. 4. 26
 *
 */

 // 2016. 9. 2  : Add code to support simple lisp 
 // 2016. 9. 3  : Add code to support divide  
 // 2017. 3. 29 : Remove simple lisp code
 // 2017. 3. 30 : Remove unused code
 // 2017. 3. 31 : Fix bug
 // 2017. 4. 26 : Add code to sum
/*-----------------------------------------------*
 *  Global variables
 *-----------------------------------------------*/
var DEBUG_PRINT = false;  // Debug Mode Option
var TRACE_PRINT = true;  // Trace Mode Option
  
// Type of End
var ErrorMessage      = "";
var IsOccuredError    = false;

var source_code       = "";
var dict              = {};            

var COMMENT           = '#';

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

function Evaluate(args)
{
    var result = "";
    var sumStack = [];
    var sumIdx = -1;
    var source_code =  args.replace(/{/g, '\n{\n').replace(/}/g, '\n}\n').split(/\n/g);
    IsOccuredError = false;


    for (var i = 0; i < source_code.length; i++) {
        var line = source_code[i].trim();
        if (line == "") continue;
        TRACE(line);
        var exp = line.split(/\s+/g);
        TRACE (exp);

        var ch = exp[0][0];

        if (ch == COMMENT) {
           // Ignore comment line
        } else if (isDelimiter(ch) || isDigit(ch)) {
           var right = "";
           var tmpRight = "";
           var startComment = -1;

           switch(ch) {
               case '=':
                   right = exp[0].substring(1);

                   for (var j = 1; j < exp.length; j++) {
                       right += exp[j];             
                   }

                   right = removeComment(right);
                   break;
               case '{':
                   sumStack[++sumIdx] = 0;
                   break; 
               case '}':
                   --sumIdx;
                   break;
               default:
                   for (var j = 0; j < exp.length; j++) {
                       right += exp[j];             
                   }
                   break;
           }

           if (right != "") {
               tmpRight = right;
               
               right = replaceSymbol(right, dict);

               try {
                   var tmp = eval(right);
                   result += tmp + " = " + tmpRight + "\n";
                   sumStack[sumIdx] += tmp;
               } catch (e) {
                   result += "Error!\n\n" + right;
               }
           } else if(ch == '=' && right == "") {
                   result += "Sum = " + sumStack[sumIdx] + "\n";  
           }
        } else {
            var left = exp[0];
            var right = "";

            if (exp.length >= 2) {
                exp[1] = exp[1].trim();
                if (exp[1][0] == '=') {
                    exp[1] = exp[1].substring(1);
                }
            }

            for (var j = 1; j < exp.length; j++) {
                right += exp[j];             
            }

            right = removeComment(right);
            right = replaceSymbol(right, dict);
 
            TRACE(right);   
            dict[left] = "(" + right + ")";
            sumStack[sumIdx] += eval(right);
            //result += eval(right) + "\n";
        }

    }
    TRACE(dict);
    result += "\n- END -";
    return result;
}

function removeComment(source_) {
     var startComment = source_.indexOf(COMMENT);

     if (startComment != -1) {
         source_ = source_.substring(0, startComment);
     }
     return source_;
}

function replaceSymbol(source_, dict_) {
     for (var k in dict_) {
         if (source_.search(k) != -1) {
             source_ = source_.replace(new RegExp(k, 'g'), dict_[k]);
         }
     }
     return source_;
}

function isDelimiter ( ch )
{
    if ("+-/*=(){}=;".indexOf(ch) != -1)
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

