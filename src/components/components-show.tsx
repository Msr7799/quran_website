"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";  
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
 import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import React from "react";

const tabs = ["النماذج", "التخطيط", "التنقل", "عرض البيانات", "التغذية الراجعة"];

const ComponentsShow = () => {
  const [selected, setSelected] = useState(tabs[0]);

  const renderContent = () => {
    switch (selected) {
      case "النماذج": return <FormComponents />;
      case "التخطيط": return <LayoutComponents />;
      case "التنقل": return <NavigationComponents />;
      case "عرض البيانات": return <DataDisplayComponents />;
      case "التغذية الراجعة": return <FeedbackComponents />;
      default: return <FormComponents />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            معرض مكونات الواجهة
          </h1>
          <p className="text-slate-600 dark:text-slate-400">استكشف جميع مكونات الواجهة المتاحة</p>
        </div>
        <ChipTabs selected={selected} setSelected={setSelected} />
        <div className="mt-8">{renderContent()}</div>
      </div>
    </div>
  );
};

const ChipTabs = ({ selected, setSelected }: { selected: string, setSelected: Dispatch<SetStateAction<string>> }) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
      {tabs.map((tab) => (
        <Chip key={tab} text={tab} selected={selected === tab} setSelected={setSelected} />
      ))}
    </div>
  );
};

const Chip = ({ text, selected, setSelected }: { text: string; selected: boolean; setSelected: Dispatch<SetStateAction<string>>; }) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected
          ? "text-white"
          : "text-slate-600 hover:text-slate-800 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-slate-200 dark:hover:bg-slate-700"
      } text-sm transition-colors px-4 py-2 rounded-lg relative font-medium`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg shadow-lg"
        />
      )}
    </button>
  );
};

const ComponentCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <Card className="h-fit">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const FormComponents = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ComponentCard title="Button" description="أزرار متنوعة">
      <div className="space-y-2">
        <Button className="w-full">زر افتراضي</Button>
        <Button variant="secondary" className="w-full">زر ثانوي</Button>
        <Button variant="destructive" className="w-full">زر خطر</Button>
        <Button variant="outline" className="w-full">زر محدد</Button>
      </div>
    </ComponentCard>

    <ComponentCard title="Input & Label" description="حقول الإدخال">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input type="email" id="email" placeholder="أدخل بريدك" />
        </div>
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <Input type="password" id="password" placeholder="••••••••" />
        </div>
      </div>
    </ComponentCard>

    <ComponentCard title="Textarea" description="نص متعدد الأسطر">
      <div className="space-y-2">
        <Label htmlFor="message">الرسالة</Label>
        <Textarea id="message" placeholder="اكتب رسالتك هنا..." rows={4} />
      </div>
    </ComponentCard>

    <ComponentCard title="Checkbox" description="خانات اختيار">
      <div className="space-y-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox id="terms" />
          <Label htmlFor="terms">أوافق على الشروط</Label>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox id="newsletter" defaultChecked />
          <Label htmlFor="newsletter">النشرة الإخبارية</Label>
        </div>
      </div>
    </ComponentCard>

    <ComponentCard title="Select" description="قوائم اختيار">
      <div className="space-y-2">
        <Label>اختر البلد</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="اختر بلدك" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sa">السعودية</SelectItem>
            <SelectItem value="ae">الإمارات</SelectItem>
            <SelectItem value="kw">الكويت</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ComponentCard>

    <ComponentCard title="Switch" description="مفاتيح التبديل">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">الإشعارات</Label>
          <Switch id="notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">الوضع المظلم</Label>
          <Switch id="dark-mode" defaultChecked />
        </div>
      </div>
    </ComponentCard>

    <ComponentCard title="Slider" description="شريط تمرير">
      <div className="space-y-4">
        <div>
          <Label>مستوى الصوت</Label>
          <Slider defaultValue={[50]} max={100} className="mt-2" />
        </div>
        <div>
          <Label>السطوع</Label>
          <Slider defaultValue={[75]} max={100} className="mt-2" />
        </div>
      </div>
    </ComponentCard>

    <ComponentCard title="RadioGroup" description="خيار واحد">
      <RadioGroup defaultValue="basic">
        <div className="flex items-center space-x-2 space-x-reverse">
          <RadioGroupItem value="basic" id="basic" />
          <Label htmlFor="basic">أساسي</Label>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <RadioGroupItem value="pro" id="pro" />
          <Label htmlFor="pro">محترف</Label>
        </div>
      </RadioGroup>
    </ComponentCard>
  </div>
);

const LayoutComponents = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ComponentCard title="Card" description="بطاقات المحتوى">
      <Card>
        <CardHeader>
          <CardTitle>عنوان البطاقة</CardTitle>
          <CardDescription>وصف البطاقة</CardDescription>
        </CardHeader>
        <CardContent>
          <p>محتوى البطاقة هنا</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">إجراء</Button>
        </CardFooter>
      </Card>
    </ComponentCard>

    <ComponentCard title="Separator" description="فواصل">
      <div className="space-y-4">
        <div>النص الأول</div>
        <Separator />
        <div>النص الثاني</div>
        <Separator />
        <div>النص الثالث</div>
      </div>
    </ComponentCard>

    <ComponentCard title="Accordion" description="قوائم قابلة للطي">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>السؤال الأول</AccordionTrigger>
          <AccordionContent>إجابة السؤال الأول</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>السؤال الثاني</AccordionTrigger>
          <AccordionContent>إجابة السؤال الثاني</AccordionContent>
        </AccordionItem>
      </Accordion>
    </ComponentCard>
  </div>
);

const NavigationComponents = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ComponentCard title="Tabs" description="علامات تبويب">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">الحساب</TabsTrigger>
          <TabsTrigger value="password">كلمة المرور</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
            محتوى الحساب
          </div>
        </TabsContent>
        <TabsContent value="password" className="mt-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
            محتوى كلمة المرور
          </div>
        </TabsContent>
      </Tabs>
    </ComponentCard>
  </div>
);

const DataDisplayComponents = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ComponentCard title="Badge" description="شارات وعلامات">
      <div className="flex flex-wrap gap-2">
        <Badge>افتراضي</Badge>
        <Badge variant="secondary">ثانوي</Badge>
        <Badge variant="destructive">تحذير</Badge>
        <Badge variant="outline">محدد</Badge>
      </div>
    </ComponentCard>

    <ComponentCard title="Avatar" description="صور المستخدمين">
      <div className="flex space-x-4 space-x-reverse">
        <Avatar>
          <AvatarFallback>أح</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>س م</AvatarFallback>
        </Avatar>
      </div>
    </ComponentCard>
  </div>
);

const FeedbackComponents = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ComponentCard title="Alert" description="رسائل تنبيه">
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>تنبيه!</AlertTitle>
          <AlertDescription>رسالة تنبيه للمستخدم</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ!</AlertTitle>
          <AlertDescription>حدث خطأ ما</AlertDescription>
        </Alert>
      </div>
    </ComponentCard>

    <ComponentCard title="Progress" description="شريط التقدم">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>التقدم</span>
            <span>60%</span>
          </div>
          <Progress value={60} />
        </div>
      </div>
    </ComponentCard>

    <ComponentCard title="Dialog" description="نوافذ حوارية">
      <Dialog>
        <DialogTrigger asChild>
          <Button>فتح النافذة</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد العملية</DialogTitle>
            <DialogDescription>هل تريد المتابعة؟</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">إلغاء</Button>
            <Button>تأكيد</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ComponentCard>

    <ComponentCard title="AlertDialog" description="تأكيد العمليات">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">حذف</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>لا يمكن التراجع عن هذا الإجراء</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction>نعم، احذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ComponentCard>
  </div>
);

export default ComponentsShow;
