const tableHeading = "<h2>Zeppelin's Easter eggs</h2><p><table style=\"width:100%\" border=\"1\"><tbody id=\"pole-position\"><tr><th>Icon</th><th>Hash</th> <th>easter-egg</th></tr>"
const tableTail = "</tbody></table>"
function tableRow(icon, hash, preImage){
    let row = "<tr><td align=\"center\">"+icon+"</td><td align=\"center\">"+hash+"</td> <td align=\"center\">"+preImage+"</td></tr>";
    return row;
}

export {tableHeading,tableTail,tableRow}
//   <tr>
//     <td align="center"><img height="64" width="64" src="https://cdn-images-1.medium.com/max/620/1*eE-UPqBn00vcDzo95me5Qw.jpeg" alt=""></td>
//     <td align="center">2d0fcdea612272668d6d99940f2cc4a79c5d06f3a9d1885e4a1021109921169c</td>
//     <td align="center">esta es la frase magica</td>
//   </tr>
//   <tr>
//     <td>Eve</td>
//     <td>Jackson</td>
//     <td>94</td>
//   </tr>
//   <tr>
//     <td>John</td>
//     <td>Doe</td>
//     <td>80</td>
//   </tr>
