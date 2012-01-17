Elastic CSS Framework Syntax

Reserved words:

clearfix            (-e-clearfix)             
unit                (-e-unit)                 {e-clearfix}
full-height         (-e-full-height)          
full-width          (-e-full-width)           
top                 (-e-vertical-top)         
bottom              (-e-vertical-bottom)      
vertical-center     (-e-vertical-center)      
horizontal-center   (-e-horizontal-center)    
center              (-e-center)               (e-horizontal-center -e-vertical-center)
columns             (-e-columns)              (e-unit)
column              (-e-column)
container           (-e-container)
same-height         (-e-same-height)
full-height         (-e-full-height)
full-width          (-e-full-width)
fixed               (-e-fixed)
elastic             (-e-elastic)
on-#                (-e-on-#)
span-#              (-e-span-#)
adaptive-#-#        (-e-adaptive-#-#)

<e></e>
<i></i>
<b></b>
<ib></ib>

e  = any element i | b | ib
i  = inline
b  = block
ib = inlineblock

The basics:

clearfix:
    Just apply clearfix to the element
    <e class="">
        <e style="float:left|right;">
    </e>
    
    +---+----------+----+
        |          |
        +----------+
    
    <e class="clearfix">
        <e style="float:left|right;">
    </e>
    +-------------------+
    |   +----------+    |
    |   |          |    |
    |   +----------+    |
    +-------------------+
    