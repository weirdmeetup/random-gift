//
//  ViewController.swift
//  random-gift
//
//  Created by perchten on 9/21/16.
//  Copyright © 2016 taromati. All rights reserved.
//

import Cocoa

class ViewController: NSViewController {

    var emailList: [String] = [];

    @IBOutlet weak var presentNameTextField: NSTextField!
    @IBOutlet weak var presentCountComboBox: NSComboBox!
    @IBOutlet weak var rollButton: NSButton!
    
    @IBOutlet var outputTextView: NSTextView!

    @IBAction func fileOpen(_ sender: NSButton) {
        let panel = NSOpenPanel();
        panel.allowsMultipleSelection = false;
        panel.canCreateDirectories = false;
        panel.canChooseDirectories = false;
        panel.canChooseFiles = true;
        panel.allowedFileTypes = ["csv"];
        
        panel.begin { (result) in
            if (result == NSFileHandlingPanelOKButton) {
                DispatchQueue.global(qos: DispatchQoS.QoSClass.background).async {
                    guard let url = panel.url
                        , let data = NSData.init(contentsOf: url)
                        , let dataString = String(data: data as Data, encoding: .utf8)
                        else { return; };
                    
                    self.emailList = dataString.components(separatedBy: "\r\n");
                    self.emailList.remove(at: 0);
                    
                    DispatchQueue.main.async {
                        self.presentNameTextField.isEnabled = true;
                        self.presentCountComboBox.isEnabled = true;
                        self.rollButton.isEnabled = true;
                        self.presentNameTextField.becomeFirstResponder();
                    }
                }
            }
        }
    }
    
    @IBAction func roll(_ sender: NSButton) {
        let presentName = presentNameTextField.stringValue;
        let count = presentCountComboBox.indexOfSelectedItem + 1;
        
        for index in (1...count) {
            let randomIndex = Int(arc4random_uniform(UInt32(emailList.count)));
            let email = emailList[randomIndex];
            self.emailList.remove(at: randomIndex);
            
            self.outputTextView.textStorage?
                .append(NSAttributedString(string: "\(presentName) - \(index) - \(email)\n"));
        }
        
        self.presentNameTextField.stringValue = "";
        self.presentCountComboBox.deselectItem(at: count - 1);
        
        self.presentNameTextField.becomeFirstResponder();
    }
}

