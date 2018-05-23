const tableHeading = "<h2>Zeppelin's Easter eggs</h2><p><table style=\"width:100%\" border=\"1\"><tbody id=\"pole-position\"><tr><th>Icon</th><th>Hash</th> <th>easter-egg</th></tr>"
const tableTail = "</tbody></table>"
function tableRow(icon, hash, preImage){
    let row = "<tr><td align=\"center\">"+icon+"</td><td align=\"center\">"+hash+"</td> <td align=\"center\">"+preImage+"</td></tr>";
    return row;
}

export {tableHeading,tableTail,tableRow}
