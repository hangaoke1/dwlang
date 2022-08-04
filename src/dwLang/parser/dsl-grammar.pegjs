{
  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

  function optionalList(value) {
    return value !== null ? value : [];
  }

  function buildBinaryExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "BinaryExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function buildLogicalExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "LogicalExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function buildOption(info) {
    const { qNumber, sNumber, oNumber } = info
    const variableInfo = {
      type: 'Option',
      qNumber,
      sNumber,
      oNumber,
    }
    return variableInfo
  }

  function buildQuestion(info) {
    const { qNumber } = info
    const variableInfo = {
      type: 'Question',
      qNumber,
    }
    return variableInfo
  }

  function buildSubQuestion(info) {
    const { qNumber, sNumber } = info
    const variableInfo = {
      type: 'SubQuestion',
      qNumber,
      sNumber,
    }
    return variableInfo
  }

  function buildRangeExpression(startIndex, endIndex, builder) {
    const list = []
    for (let i = endIndex; i >= startIndex; i--) {
      const item = builder(i)
      list.shift(item)
    }
    return list
  }
}

Start
  = __ program:Program __ { return program; }

Program
  = body:SourceElements? {
  return {
    type: "Program",
    body: optionalList(body)
  };
}

SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
    return buildList(head, tail, 1);
  }

SourceElement
 = IfStatement
 / ShowCallExpression
 / HideCallExpression

IfStatement
  = If __ test:IfTest __ Then __ consequent:IfConsequent {
    return {
      type: "IfStatement",
      test,
      consequent,
    }
  }

IfTest
  = LogicalORExpression

IfConsequent
  = ShowCallExpression
  / HideCallExpression

If
 = 'if'

Then
 = 'then'

// ==== 与或非、四则运算、关系运算 start ====
Expression
  = LogicalORExpression

LogicalOROperator
  = "or"

LogicalORExpression
  = head:LogicalANDExpression
    tail:(__ LogicalOROperator __ LogicalANDExpression)*
    { return buildLogicalExpression(head, tail); }

LogicalANDOperator
  = "and"

LogicalANDExpression
  = head:EqualityExpression
    tail:(__ LogicalANDOperator __ EqualityExpression)*
    { return buildLogicalExpression(head, tail); }

EqualityOperator
  = "=="
  / "!="

EqualityExpression
  = head:RelationalExpression
    tail:(__ EqualityOperator __ RelationalExpression)*
    { return buildBinaryExpression(head, tail); }

RelationalOperator
  = "<="
  / ">="
  / $("<" !"<")
  / $(">" !">")

RelationalExpression
  = head:AdditiveExpression
    tail:(__ RelationalOperator __ AdditiveExpression)*
    { return buildBinaryExpression(head, tail); }

AdditiveOperator
  = $("+" ![+=])
  / $("-" ![-=])

AdditiveExpression
  = head:MultiplicativeExpression
    tail:(__ AdditiveOperator __ MultiplicativeExpression)*
    { return buildBinaryExpression(head, tail); }

MultiplicativeOperator
  = $("*" !"=")
  / $("/" !"=")
  / $("%" !"=")

MultiplicativeExpression
  = head:UnaryExpression
    tail:(__ MultiplicativeOperator __ UnaryExpression)*
    { return buildBinaryExpression(head, tail); }

UnaryOperator
  = "not"

UnaryExpression
  = PrimaryExpression
  / operator:UnaryOperator __ argument:PrimaryExpression {
      return {
        type: "UnaryExpression",
        operator: operator,
        argument: argument,
        prefix: true
      };
    }

PrimaryExpression
  = Literal
  / Option / SubQuestion / Question
  / GlobalVariable
  / "(" exp:Expression ")" {
    return exp
  }

Literal
  = NumericLiteral
  / StringLiteral

NumericLiteral "number"
  = DecimalLiteral

DecimalLiteral
  = DecimalIntegerLiteral "." DecimalDigit* {
      return { type: "Literal", value: parseFloat(text()) };
    }
  / "." DecimalDigit+ {
      return { type: "Literal", value: parseFloat(text()) };
    }
  / DecimalIntegerLiteral {
      return { type: "Literal", value: parseFloat(text()) };
    }

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

StringLiteral
  = '"' chars:DoubleStringCharacter* '"' {
    return { type: "Literal", value: chars.join("") };
  }
  / "'" chars:SingleStringCharacter* "'" {
    return { type: "Literal", value: chars.join("") };
  }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }

SourceCharacter
  = .

// ==== 与或非、四则运算、关系运算 end ====


// ==== action start ====
HideCallExpression
  = Hide __ arg:HideArguments {
    return {
      type: 'CallExpression',
      callee: 'hide',
      arguments: arg,
    }
  }

Hide
  = 'hide'

HideArguments
  = first:HideItemPrimary others:(__ ',' __ HideItemPrimary)* {
    const list = [...first]
    others.forEach(o => {
      list.push(...o[3])
    })
    return list
  }

HideItemPrimary
  = Options
  / SubQuestions
  / Questions

ShowCallExpression
  = Show __ arg:HideArguments {
    return {
      type: 'CallExpression',
      callee: 'show',
      arguments: arg,
    }
  }

Show
  = 'show'

// ==== action end ====


GlobalVariable
  = '{' path:GlobalVariablePath '}' {
    return {
      type: 'GlobalVariable',
      path,
    }
  }

GlobalVariablePath
  = head:VariableName tail:(. VariableName)*  {
    return head + tail.map(item => item.join('')).join('')
  }

VariableName
  = [a-zA-Z0-9\_]+ {
    return text()
  }

Number
  = [0-9]+ {
    return Number(text())
  }

Chars
  = [a-zA-Z0-9]+ {
    return text()
  }

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / Zs

Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

Comment = SingleLineComment

SingleLineComment
  = "#" (!LineTerminator SourceCharacter)*

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"
__
  = (WhiteSpace / LineTerminatorSequence / Comment)*




// 问题、子问题、选项相关
RangeOperator
  = '~'

RangeExpression
  = start:Number RangeOperator end:Number {
    if (start >= end) {
      error('范围不正确')
    }
    return {
      start,
      end,
    }
  }

Options
  =
  q:OptionPrefix range:RangeExpression {
    return buildRangeExpression(range.start, range.end, (index) => {
      return buildOption({
        qNumber: q.qNumber,
        sNumber: q.sNumber,
        oNumber: index,
      })
    })
  }
  / o:Option {
    return [o]
  }

SubQuestions
  = q:SubQuestionPrefix range:RangeExpression {
    return buildRangeExpression(range.start, range.end, (index) => {
      return buildSubQuestion({
        qNumber: q.qNumber,
        sNumber: index,
      })
    })
  }
  / s:SubQuestion {
    return [s]
  }

Questions
  = QuestionPrefix range:RangeExpression {
    return buildRangeExpression(range.start, range.end, (index) => {
      return buildQuestion({
        qNumber: index,
      })
    })
  }
  / q:Question {
    return [q]
  }

QuestionPrefix
  = 'Q'

Question
  = QuestionPrefix index:Number {
    return buildQuestion({
      qNumber: index
    })
  }

SubQuestionPrefix
  = q:Question 'S' {
    return q
  }

SubQuestion
  = q:SubQuestionPrefix index:Number {
    return buildSubQuestion({
      qNumber: q.qNumber,
      sNumber: index
    })
  }

OptionPrefix
  = q:SubQuestion 'A' {
    return q
  }
  / q:Question 'A' {
    return q
  }

Option
  = q:OptionPrefix index:Number {
    return buildOption({
      qNumber: q.qNumber,
      sNumber: q.sNumber,
      oNumber: index,
    })
  }
