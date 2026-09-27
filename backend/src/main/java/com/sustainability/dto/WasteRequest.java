package com.sustainability.dto;

public class WasteRequest {
    private String industry;
    private String swaste;
    private String owaste;
    private String ewaste;
    private String Hwaste;
    private String rcycwaste;
    private String composted;

    public WasteRequest() {}
    public String getIndustry() { return industry; }
    public void setIndustry(String v) { this.industry = v; }
    public String getSwaste() { return swaste; }
    public void setSwaste(String v) { this.swaste = v; }
    public String getOwaste() { return owaste; }
    public void setOwaste(String v) { this.owaste = v; }
    public String getEwaste() { return ewaste; }
    public void setEwaste(String v) { this.ewaste = v; }
    public String getHwaste() { return Hwaste; }
    public void setHwaste(String v) { this.Hwaste = v; }
    public String getRcycwaste() { return rcycwaste; }
    public void setRcycwaste(String v) { this.rcycwaste = v; }
    public String getComposted() { return composted; }
    public void setComposted(String v) { this.composted = v; }
}
