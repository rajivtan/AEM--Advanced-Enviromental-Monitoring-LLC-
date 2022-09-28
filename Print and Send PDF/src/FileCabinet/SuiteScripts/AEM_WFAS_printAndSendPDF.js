/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 * @NModuleScope SameAccount
 */
// BEGIN SCRIPT DESCRIPTION BLOCK ==================================
{
    /* 
      Script Name: AEM_WFAS_printAndSendPDF.js 
      Author: Rajiv Tanwar
      Company: Blue Flame Labs PVt Ltd
      Date: 15-09-2022 
  
      Script Modification Log: 
      -- version--        -- Date --      -- Modified By --      --Requested By--                                     -- Description -- 
      version 1           15-09-2022        Rajiv Tanwar       Cory Anderson (AEM) [cory.anderson@aem.eco]           This script creates PDF and send the PDF attached in email. PDF are called and created on the basis of Customer country and subsidiary. 
      */
}
// END SCRIPT DESCRIPTION BLOCK ====================================
 define(['N/render','N/record','N/xml', 'N/email', 'N/runtime', 'N/file'],

 function(render,record,xml, email, runtime, file){
    function onAction(context){
        try{
            createNsendPDF(context)
        }catch(error){
            log.error("ERROR IN onAction() FUNCTION", error)
        }
    }
/**
 * @param{Function}- Description : Check customer country and subsidiary and call the required function to create and send the pdf through e-mail.
 * @param {Object} context : Holds the context object of onAction function. 
 */
    function createNsendPDF(context){
        try{
           // if (context.type == "create"){
                var senderId = runtime.getCurrentUser();
                senderId = senderId.id
                var newRecord = context.newRecord;
                var recId = newRecord.id;
                var eMailAddr = newRecord.getValue({fieldId: "custbody_item_receipt_email_address"}) //runtime.getCurrentUser();
                // eMailAddr = eMailAddr.id
                var rmaId = newRecord.getValue({fieldId: "tranid"});
                var customerId = newRecord.getValue({fieldId:"entity"});
                var mailSubject = newRecord.getValue({fieldId:"custbody_rma_lable_subject"});
                var mailBody = newRecord.getValue({fieldId: "custbody_rma_label_body"});
                var mailCC = newRecord.getValue({fieldId:"custbody_rma_label_cc"});
                var custRec = record.load({type: record.Type.CUSTOMER, id:customerId});
                var customerSubsidiary = custRec.getValue({fieldId:"subsidiary"})
                log.debug("Subsidiary", customerSubsidiary)
                if(customerSubsidiary==13){
                var lineCount = custRec.getLineCount({sublistId:'addressbook'});
                if(lineCount>0){
                        var defaultBilling = custRec.getSublistValue({sublistId: 'addressbook',fieldId: 'defaultbilling',line: 0});
                            var addrsSubRec = custRec.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: 0});
                            var country = addrsSubRec.getValue({fieldId: "country"})
                            if(country == "US"){
                                usaPDF(rmaId, senderId, eMailAddr, mailSubject, mailBody, mailCC)
                            }else if (country == "CA"){
                                canadaPDF(rmaId, senderId, eMailAddr, mailSubject, mailBody, mailCC)
                            }                    
                }
            }
                

          // }

        }catch(error){
            log.error("ERROR IN createNsendPDF() FUNCTION", error)
        }
    }
/**
 * @param {Function} Description : Creates and send the pdf through e-mail for Canada customer.
 * @param {String} rmaId : Return Authorization Number. 
 * @param {Number} senderId : E-mail sender's id.
 * @param {String} eMailAddr : E-mail receiver's e-mail id.
 */
    function canadaPDF(rmaId, senderId, eMailAddr, mailSubject, mailBody, mailCC){
        try{
            var imgUrlFTS = "https://6765312-sb2.app.netsuite.com/core/media/media.nl?id=108244&c=6765312_SB2&h=3U4M-novyKy1nvJMYRvhtxdEd14se7OugTgrbE1xKBAVcThJ"
            var imgURLphone = "https://6765312-sb2.app.netsuite.com/core/media/media.nl?id=108245&c=6765312_SB2&h=dWb0jLuujI2QPEJ2nNPIQ2scXoB2df0YM-7tmrMjPt3V9iqD";
            var cautionURL = "https://6765312-sb2.app.netsuite.com/core/media/media.nl?id=108243&c=6765312_SB2&h=a9FRfR9plSatm9IpLD_dYH-tJcUIdlr4QYLfAW9pl0U0Y4Qe"
          
            imgUrlFTS = xml.escape({
                xmlText : imgUrlFTS
                 });

                 imgURLphone = xml.escape({
                    xmlText : imgURLphone
                     });
          
            cautionURL = xml.escape({
              xmlText : cautionURL
               });
            var strVar="";
           
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:26px;\" align =\"left\"><b>Ship To:<\/b><\/td><td align =\"right\"  style =\"border: 2px solid black; padding: 5px\"><b style=\"font-size:36px;\">Bubbler<\/b><\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:32px;\" align =\"left\">FTS Forest Technology Systems<\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:32px;\" align =\"left\">1065 Henry Eng Place<\/td><\/tr>";
            strVar += "    <tr><td  style =\"font-size:32px;\" align =\"left\">Victoria, BC     V9B 6B2<\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:20px; \" align =\"left\">Canada<\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\">(800) 548-4264<\/td><td align =\"right\"  style =\"border: 2px solid black; padding: 5px\"><b style=\"font-size:26px;\">"+rmaId+"<\/b><\/td><\/tr>";
            strVar += "    <\/table>";
            
            
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\"><p><img src='"+cautionURL+"' width=\"60\" height=\"60\"/><\/p><\/td><td align =\"left\" width=\"95%\" valign=\"middle\"><b style=\"font-size:18px;\">IMPORTANT: THIS LABEL MUST REMAIN VISIBLE!<\/b><\/td> <\/tr>";
            strVar += "    <\/table>"; 
           
           
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:11px; padding-top:10px;\" align =\"left\">------------------------------------ CUT ---------------------------------------------------------- CUT -------------------------------<\/td><\/tr>";
            strVar += "    <\/table>";
           
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:13px; margin-bottom:5px;\" align =\"left\"><u>Shipping Label Instructions:<\/u><\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:13px; padding-left:17px; line-height:25px\" align =\"left\"><p>1.  Print this form - make copies of this label if you have more than one shipping box to send.<br/>2.  Cut along the dotted line.<br/>3.  Tape the address label(s) to the outside of your shipping box(es).<\/p><\/td><\/tr>";
            strVar += "    <\/table>";
            
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\"><p><img src='"+cautionURL+"' width=\"60\" height=\"60\"/><\/p><\/td><td align =\"left\" width=\"92%\" valign=\"middle\" style=\"line-height:25px\"><b style=\"font-size:14px;\">Each box MUST have this label affixed – boxes without this label may<br/> be REJECTED and RETURNED to you at YOUR COST.<\/b><\/td> <\/tr>";
            strVar += "    <\/table>"; 


            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\"><p><img src='"+imgURLphone+"' width=\"60\" height=\"60\"/><\/p><\/td><td align =\"left\" width=\"89%\" valign=\"middle\" style=\"line-height:15px; font-size:13.5px; color:#808080; padding-left:10px\"><b>Technical Support:<\/b><br/>7:00am – 4:30pm (PST)<br/> Excluding Canadian Holidays <br/><span style=\"color:#0000ff;\"><u>techsupport@ftsinc.com<\/u><\/span><\/td> <\/tr>";
            strVar += "    <\/table>"; 


            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:13.5px; color:#808080; padding-left:90px\" align =\"left\">1.800.548.4264 (toll free)<\/td><td  style=\"font-size:20px;\" align =\"right\"><p><img src='"+imgUrlFTS+"' width=\"86\" height=\"40\"/><\/p><\/td> <\/tr>";
            strVar += "    <\/table>"; 

            strVar += "<table style=\"width: 100%;padding-top:60px;\">";
            strVar += "    <tr><td  style=\"font-size:10px; color:#808080; padding-left:30px\" align =\"right\">ISO-SV-F-091, Rev 4, June 01, 2021<\/td> <\/tr>";
            strVar += "    <\/table>"; 
           strVar += "";
          

            var xmlString  = ''
					xmlString+= "<?xml version=\"1.0\"?><!DOCTYPE pdf PUBLIC \"-\/\/big.faceless.org\/\/report\" \"report-1.1.dtd\">";
				xmlString += "<pdf>";
                
				xmlString += "<body padding=\"0.5in 0.5in 0.5in 0.5in\">"
				xmlString+=strVar
				xmlString += "<\/body><\/pdf>";

            var pdfFile = render.xmlToPdf({xmlString:xmlString});
            pdfFile.name = "Canada.pdf"

            email.send({
                author: senderId,
                recipients: eMailAddr,
                if(mailCC){cc: mailCC},
                subject: mailSubject,
                body: mailBody,
                attachments: [pdfFile]
            });
            log.debug("emailsent", "E-mail Sent Canada")

        }catch(error){
            log.error("ERROR IN canadaPDF() FUNCTION", error)
        }

    }

/**
 * @param {Function} Description : Creates and send the pdf through e-mail for USA customer.
 * @param {String} rmaId : Return Authorization Number. 
 * @param {Number} senderId : E-mail sender's id.
 * @param {String} eMailAddr : E-mail receiver's e-mail id.
 */
    function usaPDF(rmaId, senderId, eMailAddr, mailSubject, mailBody, mailCC){
        try{
            var imgUrlFTS = "https://6765312-sb2.app.netsuite.com/core/media/media.nl?id=108244&c=6765312_SB2&h=3U4M-novyKy1nvJMYRvhtxdEd14se7OugTgrbE1xKBAVcThJ"
            var imgURLphone = "https://6765312-sb2.app.netsuite.com/core/media/media.nl?id=108245&c=6765312_SB2&h=dWb0jLuujI2QPEJ2nNPIQ2scXoB2df0YM-7tmrMjPt3V9iqD";
            var cautionURL = "https://6765312-sb2.app.netsuite.com/core/media/media.nl?id=108243&c=6765312_SB2&h=a9FRfR9plSatm9IpLD_dYH-tJcUIdlr4QYLfAW9pl0U0Y4Qe"
          
            imgUrlFTS = xml.escape({
                xmlText : imgUrlFTS
                 });

                 imgURLphone = xml.escape({
                    xmlText : imgURLphone
                     });
          
            cautionURL = xml.escape({
              xmlText : cautionURL
               });
            var strVar="";
           
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:26px;\" align =\"left\"><b>Ship To:<\/b><\/td><td align =\"right\"  style =\"border: 2px solid black; padding: 5px\"><b style=\"font-size:36px;\">New Goods<\/b><\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:32px;\" align =\"left\">FTS Forest Technology Systems<\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:32px;\" align =\"left\">1124 Fir Avenue<\/td><\/tr>";
            strVar += "    <tr><td  style =\"font-size:32px;\" align =\"left\">Blaine, WA     98230<\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:20px; \" align =\"left\">USA<\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\">(800) 548-4264<\/td><td align =\"right\"  style =\"border: 2px solid black; padding: 5px\"><b style=\"font-size:26px;\">"+rmaId+"<\/b><\/td><\/tr>";
            strVar += "    <\/table>";
            
            
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\"><p><img src='"+cautionURL+"' width=\"60\" height=\"60\"/><\/p><\/td><td align =\"left\" width=\"95%\" valign=\"middle\"><b style=\"font-size:18px;\">IMPORTANT: THIS LABEL MUST REMAIN VISIBLE!<\/b><\/td> <\/tr>";
            strVar += "    <\/table>"; 
           
           
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:11px; padding-top:10px;\" align =\"left\">------------------------------------ CUT ---------------------------------------------------------- CUT -------------------------------<\/td><\/tr>";
            strVar += "    <\/table>";
           
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:13px; margin-bottom:5px;\" align =\"left\"><u>Shipping Label Instructions:<\/u><\/td><\/tr>";
            strVar += "    <tr><td  style=\"font-size:13px; padding-left:17px; line-height:25px\" align =\"left\"><p>1.  Print this form - make copies of this label if you have more than one shipping box to send.<br/>2.  Cut along the dotted line.<br/>3.  Tape the address label(s) to the outside of your shipping box(es).<\/p><\/td><\/tr>";
            strVar += "    <\/table>";
            
            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\"><p><img src='"+cautionURL+"' width=\"60\" height=\"60\"/><\/p><\/td><td align =\"left\" width=\"92%\" valign=\"middle\" style=\"line-height:25px\"><b style=\"font-size:14px;\">Each box MUST have this label affixed – boxes without this label may<br/> be REJECTED and RETURNED to you at YOUR COST.<\/b><\/td> <\/tr>";
            strVar += "    <\/table>"; 


            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:20px;\" align =\"left\"><p><img src='"+imgURLphone+"' width=\"60\" height=\"60\"/><\/p><\/td><td align =\"left\" width=\"89%\" valign=\"middle\" style=\"line-height:15px; font-size:13.5px; color:#808080; padding-left:10px\"><b>Technical Support:<\/b><br/>7:00am – 4:30pm (PST)<br/> Excluding Canadian Holidays <br/><span style=\"color:#0000ff;\"><u>techsupport@ftsinc.com<\/u><\/span><\/td> <\/tr>";
            strVar += "    <\/table>"; 


            strVar += "<table style=\"width: 100%;padding-top:10px;\">";
            strVar += "    <tr><td  style=\"font-size:13.5px; color:#808080; padding-left:90px\" align =\"left\">1.800.548.4264 (toll free)<\/td><td  style=\"font-size:20px;\" align =\"right\"><p><img src='"+imgUrlFTS+"' width=\"86\" height=\"40\"/><\/p><\/td> <\/tr>";
            strVar += "    <\/table>"; 

            strVar += "<table style=\"width: 100%;padding-top:60px;\">";
            strVar += "    <tr><td  style=\"font-size:10px; color:#808080; padding-left:30px\" align =\"right\">ISO-SV-F-090, Rev 3, June 26, 2019<\/td> <\/tr>";
            strVar += "    <\/table>"; 
           strVar += "";
          

            var xmlString  = ''
					xmlString+= "<?xml version=\"1.0\"?><!DOCTYPE pdf PUBLIC \"-\/\/big.faceless.org\/\/report\" \"report-1.1.dtd\">";
				xmlString += "<pdf>";
                
				xmlString += "<body padding=\"0.5in 0.5in 0.5in 0.5in\">"
				xmlString+=strVar
				xmlString += "<\/body><\/pdf>";

            var pdfFile = render.xmlToPdf({xmlString:xmlString});
            pdfFile.name = "USA.pdf"

            email.send({
                author: senderId,
                recipients: eMailAddr,
                if(mailCC){cc: mailCC},
                subject: mailSubject,
                body: mailBody,
                attachments: [pdfFile]
            });
            log.debug("emailsent", "E-mail Sent USA")

        }catch(error){
            log.error("ERROR IN usaPDF() FUNCTION", error)
        }

    }

    return {
        onAction: onAction
    };
 });
